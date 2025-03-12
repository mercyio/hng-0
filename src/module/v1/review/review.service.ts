import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDocument } from '../user/schemas/user.schema';
import {
  CanReviewDto,
  CreateReviewDto,
  GetCourseReviewsDto,
  HasReviewedDto,
} from './dto/review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import mongoose, { Model } from 'mongoose';
import { RepositoryService } from '../repository/repository.service';
import { CourseService } from '../course/course.service';
import { CourseProgressStatusEnum } from 'src/common/enums/course.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private courseService: CourseService,
    private repositoryService: RepositoryService,
  ) {}

  async create(user: UserDocument, payload: CreateReviewDto) {
    const { courseId, rating, comment } = payload;

    const [course, reviewExist] = await Promise.all([
      this.courseService.checkCourseExist(courseId),
      this.reviewModel.exists({
        course: courseId,
        user: user._id,
      }),
    ]);

    if (reviewExist) {
      throw new BadRequestException('You have already reviewed this course');
    }

    const session = await this.reviewModel.startSession();

    try {
      let reviewData = null;
      await session.withTransaction(async () => {
        reviewData = (
          await this.reviewModel.create(
            [
              {
                user: user._id,
                course: course._id,
                rating,
                comment,
              },
            ],
            { session },
          )
        )[0];
        const totalReviews = course.totalReviews || 0;
        const currentAverageRating = course.averageRating || 0;
        const newTotalReviews = totalReviews + 1;
        const newAverageRating =
          (currentAverageRating * totalReviews + rating) / newTotalReviews;

        await this.courseService.updateQuery(
          { _id: course._id },
          {
            averageRating: newAverageRating,
            totalReviews: newTotalReviews,
          },
          session,
        );
      });
      return reviewData;
    } catch (error) {
      throw error;
    }
  }

  async getCoursesReviews(query: GetCourseReviewsDto) {
    const { courseId, ...paginationQuery } = query;

    // count review by rating 1, 2, 3, 4, 5
    const reviewStats = await this.reviewModel.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: '$rating',
          totalReviews: { $sum: 1 },
          totalRating: { $sum: '$rating' }, // Sum of all ratings for average calculation
        },
      },
      {
        $group: {
          _id: null, // Grouping all results together
          ratings: { $push: { rating: '$_id', totalReviews: '$totalReviews' } },
          totalReviews: { $sum: '$totalReviews' },
          totalRating: { $sum: '$totalRating' },
        },
      },
      {
        $project: {
          _id: 0,
          ratings: 1,
          totalReviews: 1,
          averageRating: {
            $divide: ['$totalRating', { $multiply: ['$totalReviews', 5] }],
          }, // Average rating normalized to 5
        },
      },
    ]);

    const { data, ...paginationData } = await this.repositoryService.paginate({
      model: this.reviewModel,
      query: paginationQuery,
      options: {
        course: courseId,
      },
    });

    return {
      reviews: data,
      reviewStats: reviewStats[0],
      ...paginationData,
    };
  }

  async canReview(query: CanReviewDto, user: UserDocument) {
    const { courseId } = query;

    const order = await this.courseService.findOneQuery({
      options: {
        course: courseId,
        user: user._id,
        status: CourseProgressStatusEnum.COMPLETED,
      },
    });

    return {
      canReview: order ? true : false,
    };
  }

  async hasReviewed(query: HasReviewedDto, user: UserDocument) {
    const { courseId } = query;

    const userReviewed = await this.reviewModel.exists({
      user: user._id,
      course: courseId,
    });

    return {
      hasReviewed: userReviewed ? true : false,
    };
  }
}
