import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PipeService } from './pipe.service';

@Controller('pipe')
export class PipeController {
  // constructor(private readonly pipeService: PipeService) {}
  @Get(':id')
  getTest(@Param('id') id: number) {
    console.log('id', typeof id);
    return id;
  }
}
