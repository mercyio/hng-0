import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getUserInfo() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = `${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}`;

    return {
      email: 'mercydanke@gmail.com',
      current_datetime: `${date}T${time}Z`,
      github_url: 'https://github.com/mercyio/hng-0',
    };
  }
}
