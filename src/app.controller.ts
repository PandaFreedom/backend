import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('text/:key')
  getText(@Query('key') query: { key: string }) {
    console.log(query);
    return this.appService.getText({ text: query.key });
  }
}
