import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUserInfo() {
    const data = await this.appService.getUserInfo();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
