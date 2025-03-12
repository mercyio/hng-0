import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;
}

export class GetSingleCourseDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsMongoId()
  checkWatchlistUserId?: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
