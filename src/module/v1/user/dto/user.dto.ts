import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../repository/dto/repository.dto';
import { UserRoleEnum } from '../../../../common/enums/user.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsEnum([UserRoleEnum.USER, UserRoleEnum.MERCHANT])
  @IsOptional()
  role?: UserRoleEnum = UserRoleEnum.USER;
}

export class ChangeEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  newEmail: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  confirmPassword: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  username: string;
}

export class CheckUsernameAvailableDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class AdminGetAllUsersDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  isDeleted: boolean;

  @IsEnum([UserRoleEnum.USER, UserRoleEnum.MERCHANT])
  @IsOptional()
  role?: UserRoleEnum;
}

export class VerifyGuestUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  code: number;
}

export class UserAvailabilityDto {
  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
