import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCourseDto,
  GetSingleCourseDto,
  UpdateCourseDto,
} from './dto/course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryService } from 'src/module/v1/repository/repository.service';
// import { PaginationDto } from 'src/module/v1/repository/dto/repository.dto';
import { BaseRepositoryService } from '../repository/base.service';
import { Course, CourseDocument } from './schema/course.schema';
import { WatchlistService } from '../watchlist/watchlist.service';
import { UserDocument } from '../user/schemas/user.schema';
import { PaginationDto } from '../repository/dto/repository.dto';
// import { BaseHelper } from 'src/common/utils/helper/helper.util';
// import { uploadSingleFile } from 'src/common/utils/aws.util';

@Injectable()
export class CourseService extends BaseRepositoryService<CourseDocument> {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private repositoryService: RepositoryService,
    private watchlistService: WatchlistService,
  ) {
    super(courseModel);
  }

  async create(
    user: UserDocument,
    payload: CreateCourseDto,
    // files: Express.Multer.File[],
  ): Promise<CourseDocument> {
    try {
      // const uploadedImages =
      // files?.length > 0
      //   ? await Promise.all(
      //       files.map(async (file) => {
      //         const payload = {
      //           fileName: BaseHelper.generateFileName(
      //             'course',
      //             file.mimetype,
      //           ),
      //           buffer: file.buffer,
      //           mimetype: file.mimetype,
      //         };

      //         const uploadedFile = await uploadSingleFile(payload);

      //         return {
      //           _id: new mongoose.Types.ObjectId(),
      //           url: uploadedFile.secureUrl,
      //         };
      //       }),
      //     )
      //   : [];

      const createdCourse = await this.courseModel.create({
        user: user._id,
        ...payload,
      });
      return await createdCourse.populate('user');
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'Course with provided name already exists',
        );
      } else {
        throw new BadRequestException(
          'Something went wrong while creating course',
        );
      }
    }
  }
  // async findAll(query?: PaginationDto) {
  //   return await this.repositoryService.paginate(this.courseModel, query);
  // }

  async findOne(_id: string) {
    return await this.courseModel.findById(_id);
  }

  async update(_id: string, payload: UpdateCourseDto) {
    const { name, description } = payload;

    const courseWithNameExist = await this.courseModel.findOne({
      name,
      _id: { $ne: _id },
    });

    if (courseWithNameExist) {
      throw new BadRequestException('Course with provided name already exist');
    }

    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      _id,
      { name, description },
      { new: true },
    );

    if (!updatedCourse) {
      throw new BadRequestException('Course not found');
    }

    return updatedCourse;
  }

  async checkCourseExist(courseId: string) {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async checkCourseInWatchlist(
    course: CourseDocument | CourseDocument[],
    userId: string,
  ) {
    if (Array.isArray(course)) {
      return await Promise.all(
        course.map(async (course) => {
          const isInWatchlist = await this.watchlistService.isCourseInWatchlist(
            course._id.toString(),
            userId,
          );

          return {
            isInWatchlist,
            ...course,
          };
        }),
      );
    } else {
      const isInWatchlist = await this.watchlistService.isCourseInWatchlist(
        course._id.toString(),
        userId,
      );

      return {
        isInWatchlist,
        ...course,
      };
    }
  }

  async getSingleCourse(query: GetSingleCourseDto) {
    const { _id, checkWatchlistUserId } = query;

    const course = await this.courseModel.findById(_id).lean();

    if (!course) {
      throw new NotFoundException('course not found');
    }

    let isInWatchlist = false;
    if (checkWatchlistUserId) {
      isInWatchlist = await this.watchlistService.isCourseInWatchlist(
        _id,
        checkWatchlistUserId,
      );
    }

    return {
      isInWatchlist,
      ...course,
    };
  }

  async getMyCourses(user: UserDocument, query: PaginationDto) {
    const { searchQuery } = query;
    const coursesPaginated = await this.repositoryService.paginate({
      model: this.courseModel,
      query,
      options: {
        user: user._id,
        ...(searchQuery && this.constructSearchQuery(searchQuery)),
      },
    });

    coursesPaginated.data = (await this.checkCourseInWatchlist(
      coursesPaginated.data,
      user._id.toString(),
    )) as unknown as CourseDocument[];

    return coursesPaginated;
  }

  constructSearchQuery(query: string) {
    return {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    };
  }
}
