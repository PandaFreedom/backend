import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ZooService } from './zoo.service';

@Controller('api/zoo')
export class ZooController {
  constructor(private readonly zooService: ZooService) {}

  @Post()
  async createZooData(@Body() body: any, @Res() res: Response) {
    console.log('you are here create zoo! good bro', body.name, body.age);
    await this.zooService.createZooData(body.name, body.age);
    return res.status(200).json({ message: 'Zoo data created successfully' });
  }
  @Get()
  async getShowZooData(@Res() res: Response) {
    const result = await this.zooService.SHowZooData();
    return res.status(200).json(result);
  }
  @Delete(':id')
  async deleteZooData(@Param('id') id: string, @Res() res: Response) {
    await this.zooService.deleteZooData(Number(id));
    return res.status(200).json({
      message: 'Zoo data deleted successfully',
    });
  }
}
