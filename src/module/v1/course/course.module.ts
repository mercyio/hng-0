import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Course,
  CourseSchema,
} from 'src/module/v1/course/schema/course.schema';
import { RepositoryModule } from 'src/module/v1/repository/repository.module';
import { WatchlistModule } from '../watchlist/watchlist.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    RepositoryModule,
    WatchlistModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
