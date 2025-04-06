import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    console.log('getHello called');
    return 'Hello World!';
  }

  getText(key: { text: string }): string {
    return `this is a text ${key.text}`;
  }
}
