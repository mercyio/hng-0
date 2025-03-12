import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoggedInUserDecorator } from 'src/common/decorators/logged-in-user.decorator';
import {
  CanReviewDto,
  CreateReviewDto,
  GetCourseReviewsDto,
  HasReviewedDto,
} from './dto/review.dto';
import { ReviewService } from './review.service';
import { UserDocument } from '../user/schemas/user.schema';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(
    @Body() payload: CreateReviewDto,
    @LoggedInUserDecorator() user: UserDocument,
  ) {
    return await this.reviewService.create(user, payload);
  }

  @Public()
  @Get()
  async getCoursesReviews(@Query() query: GetCourseReviewsDto) {
    return await this.reviewService.getCoursesReviews(query);
  }

  @Get('can-review')
  async canReview(
    @Query() query: CanReviewDto,
    @LoggedInUserDecorator() user: UserDocument,
  ) {
    return await this.reviewService.canReview(query, user);
  }

  @Get('has-reviewed')
  async hasReviewed(
    @Query() query: HasReviewedDto,
    @LoggedInUserDecorator() user: UserDocument,
  ) {
    return await this.reviewService.hasReviewed(query, user);
  }
}
