import { IsMongoId, IsNotEmpty } from 'class-validator';

export class addOrRemoveWatchlistDto {
  @IsNotEmpty()
  @IsMongoId()
  courseId: string;
}
