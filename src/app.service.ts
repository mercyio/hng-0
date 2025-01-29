import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getUserInfo() {
    return {
      email: 'mercydanke@gmail.com',
      current_datetime: new Date().toISOString(),
      github_url: 'https://github.com/mercyio/hng-0',
    };
  }
}
