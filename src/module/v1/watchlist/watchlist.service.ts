import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from '../repository/dto/repository.dto';
import { RepositoryService } from '../repository/repository.service';
import { Watchlist, WatchlistDocument } from './schema/watchlist.schema';
import { addOrRemoveWatchlistDto } from './dto/watchlist.dto';
import { UserDocument } from '../user/schemas/user.schema';
import { CourseService } from '../course/course.service';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist.name)
    private watchlistModel: Model<WatchlistDocument>,
    @Inject(forwardRef(() => CourseService))
    private courseService: CourseService,
    private repositoryService: RepositoryService,
  ) {}

  async addOrRemoveWatchlist(
    payload: addOrRemoveWatchlistDto,
    user: UserDocument,
  ) {
    const { courseId } = payload;
    const userId = user._id;

    const [alreadyInWatchlist] = await Promise.all([
      this.watchlistModel.exists({
        user: userId,
        course: courseId,
      }),
      this.courseService.checkCourseExist(courseId),
    ]);

    if (alreadyInWatchlist) {
      await this.watchlistModel.findOneAndDelete({
        course: courseId,
        user: userId,
      });
      return;
    }

    const watchlistItem = await this.watchlistModel.create({
      course: courseId,
      user: userId,
    });

    return watchlistItem;
  }

  async getMyWatchlist(user: UserDocument, query: PaginationDto) {
    return await this.repositoryService.paginate({
      model: this.watchlistModel,
      query,
      options: { user: user._id },
    });
  }

  async isCourseInWatchlist(courseId: string, userId: string) {
    const watchlistItem = await this.watchlistModel.exists({
      course: courseId,
      user: userId,
    });

    return !!watchlistItem;
  }
}
