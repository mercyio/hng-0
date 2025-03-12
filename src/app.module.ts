import { Module } from '@nestjs/common';
import { AuthModule } from './module/v1/auth/auth.module';
import { UserModule } from './module/v1/user/user.module';
import { RepositoryModule } from './module/v1/repository/repository.module';
import { OtpModule } from './module/v1/otp/otp.module';
import { MailModule } from './module/v1/mail /mail.module';
import { ReviewModule } from './module/v1/review/review.module';
import { CourseModule } from './module/v1/course/course.module';
import { DatabaseModule } from './module/v1/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    RepositoryModule,
    MailModule,
    OtpModule,
    ReviewModule,
    CourseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
