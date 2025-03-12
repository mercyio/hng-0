import {
  BadRequestException,
  ConflictException,
  Injectable,
  Inject,
  forwardRef,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/services/user.service';
import {
  ForgotPasswordDto,
  GoogleAuthDto,
  LoginDto,
  RequestVerifyEmailOtpDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { BaseHelper } from '../../../common/utils/helper/helper.util';
import { OtpService } from '../otp/services/otp.service';
import { ENVIRONMENT } from '../../../common/configs/environment';
import { UserRoleEnum } from '../../../common/enums/user.enum';
import { ERROR_CODES } from '../../../common/constants/error-codes.constant';
import { OtpTypeEnum } from '../../../common/enums/otp.enum';
import { AppError } from '../../../common/filter/app-error.filter';
import { MailService } from '../mail /mail.service';
import { welcomeEmailTemplate } from '../mail /templates/welcome.email';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,
    private mailService: MailService,
  ) {}

  async register(payload: CreateUserDto, role?: UserRoleEnum) {
    const user = await this.userService.createUser(payload, role);

    await this.otpService.sendOTP({
      email: user.email,
      type: OtpTypeEnum.VERIFY_EMAIL,
    });

    return user;
  }

  async login(payload: LoginDto) {
    const { email, password } = payload;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.userService.getUserDetailsWithPassword({ email });

    if (!user) {
      throw new BadRequestException('Invalid Credential');
    }

    const passwordMatch = await BaseHelper.compareHashedData(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Incorrect Password');
    }

    if (!user.emailVerified) {
      throw new AppError(
        'kindly verify your email to login',
        HttpStatus.BAD_REQUEST,
        ERROR_CODES.EMAIL_NOT_VERIFIED,
      );
    }

    const token = this.jwtService.sign(
      { _id: user._id },
      {
        secret: ENVIRONMENT.JWT.SECRET,
      },
    );
    delete user['_doc'].password;

    return {
      ...user['_doc'],
      accessToken: token,
    };
  }

  async verifyEmail(payload: VerifyEmailDto) {
    const { code, email } = payload;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid Email');
    }

    if (user.emailVerified) {
      throw new UnprocessableEntityException('Email already verified');
    }

    await this.otpService.verifyOTP(
      {
        code,
        email,
        type: OtpTypeEnum.VERIFY_EMAIL,
      },
      true,
    );

    await this.userService.updateQuery(
      { email },
      {
        emailVerified: true,
      },
    );

    const welcomeEmailName = user?.name || 'User';
    await this.mailService.sendEmail(
      user.email,
      `Welcome To ${ENVIRONMENT.APP.NAME}`,
      welcomeEmailTemplate({
        name: welcomeEmailName,
      }),
    );
  }

  async sendVerificationMail(payload: RequestVerifyEmailOtpDto) {
    await this.userService.checkUserExistByEmail(payload.email);

    await this.otpService.sendOTP({
      ...payload,
      type: OtpTypeEnum.VERIFY_EMAIL,
    });
  }

  async sendPasswordResetEmail(payload: ForgotPasswordDto) {
    await this.userService.checkUserExistByEmail(payload.email);

    await this.otpService.sendOTP({
      ...payload,
      type: OtpTypeEnum.RESET_PASSWORD,
    });
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { email, password, confirmPassword, code } = payload;

    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    await this.otpService.verifyOTP(
      {
        email,
        code,
        type: OtpTypeEnum.RESET_PASSWORD,
      },
      true,
    );

    const hashedPassword = await BaseHelper.hashData(password);

    await this.userService.updateQuery({ email }, { password: hashedPassword });
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateQuery({ _id: userId }, { loginToken: null });
  }

  async googleAuth(payload: GoogleAuthDto) {
    const { email } = payload;

    const user = await this.userService.getUserByEmail(email);

    if (user) {
      if (!user.isGoogleAuth) {
        throw new ConflictException(
          'Use your existing login details or choose a different email address to sign up with Google',
        );
      }
      await this.userService.updateUserByEmail(email, {
        isLoggedOut: false,
      });

      const token = this.jwtService.sign({ _id: user._id });
      return { ...user['_doc'], accessToken: token };
    }

    const newUser = await this.userService.createUserFromGoogle(payload);

    const token = this.jwtService.sign({ _id: newUser._id });
    return { ...newUser['_doc'], accessToken: token };
  }
}
