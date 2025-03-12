import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { OtpModule } from '../otp/otp.module';
import { RepositoryModule } from '../repository/repository.module';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminUserService } from './services/admin-user.service';
import { MailModule } from '../mail /mail.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => OtpModule),
    MailModule,
    RepositoryModule,
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserService, AdminUserService],
  exports: [UserService, AdminUserService],
})
export class UserModule {}
