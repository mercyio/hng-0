import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UploadedFiles,
  Query,
  UseInterceptors,
  // Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  CreateCourseDto,
  GetSingleCourseDto,
  UpdateCourseDto,
} from './dto/course.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LoggedInUserDecorator } from 'src/common/decorators/logged-in-user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { PaginationDto } from '../repository/dto/repository.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
// import { PaginationDto } from 'src/module/v1/repository/dto/repository.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @LoggedInUserDecorator() user: UserDocument,
    @Body() payload: CreateCourseDto,
    // @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.courseService.create(user, payload);
  }

  // @Public()
  // @Get()
  // findAll(@Query() query: PaginationDto) {
  //   return this.courseService.findAll(query);
  // }

  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() payload: UpdateCourseDto) {
    return this.courseService.update(_id, payload);
  }

  @Get('my-courses')
  async getMyCourses(
    @LoggedInUserDecorator() user: UserDocument,
    @Query() query: PaginationDto,
  ) {
    return await this.courseService.getMyCourses(user, query);
  }

  @Public()
  @Get('single')
  async getSingleCourse(@Query() query: GetSingleCourseDto) {
    return await this.courseService.getSingleCourse(query);
  }

  @Delete()
  remove(@Query('_id') _id: string) {
    return this.courseService.softDelete(_id);
  }
}
