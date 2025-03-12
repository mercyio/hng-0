import { Module } from '@nestjs/common';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { CourseModule } from '../course/course.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Review.name,
        schema: ReviewSchema,
      },
    ]),
    CourseModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
