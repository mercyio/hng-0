import { Controller, Patch, Body, Get, Query } from '@nestjs/common';
import { LoggedInUserDecorator } from 'src/common/decorators/logged-in-user.decorator';
import { PaginationDto } from '../repository/dto/repository.dto';
import { addOrRemoveWatchlistDto } from './dto/watchlist.dto';
import { WatchlistService } from './watchlist.service';
import { IDQueryDto } from 'src/common/dto/query.dto';
import { UserDocument } from '../user/schemas/user.schema';

@Controller('course/watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Patch()
  async addOrRemoveWatchlist(
    @Body() payload: addOrRemoveWatchlistDto,
    @LoggedInUserDecorator() user: UserDocument,
  ) {
    return await this.watchlistService.addOrRemoveWatchlist(payload, user);
  }

  @Get('my-watchlist')
  async getMyWatchlist(
    @LoggedInUserDecorator() user: UserDocument,
    @Query() query: PaginationDto,
  ) {
    return await this.watchlistService.getMyWatchlist(user, query);
  }

  @Get('check')
  async isCourseInWatchlist(
    @Query() { _id }: IDQueryDto,
    @LoggedInUserDecorator() user: UserDocument,
  ) {
    return await this.watchlistService.isCourseInWatchlist(
      _id,
      user._id.toString(),
    );
  }
}
