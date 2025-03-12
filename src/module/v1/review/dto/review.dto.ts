import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { PaginationDto } from '../../repository/dto/repository.dto';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsMongoId({ message: 'Course id is not valid' })
  courseId: string;

  @IsNotEmpty()
  @IsOptional()
  comment: string;
}

export class GetCourseReviewsDto extends PaginationDto {
  @IsMongoId({ message: 'Course id is not valid' })
  courseId: string;
}

export class CanReviewDto {
  @IsMongoId({ message: 'Course id is not valid' })
  courseId: string;
}

export class HasReviewedDto {
  @IsMongoId({ message: 'Course id is not valid' })
  courseId: string;
}
