import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getUserInfo() {
    const now = new Date();
    const time = `${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}`;

    return {
      email: 'mercydanke@gmail.com',
      current_datetime: time,
      github_url: 'https://github.com/mercyio/hng-0',
    };
  }
}
