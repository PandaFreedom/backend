import { Controller, Get } from '@nestjs/common';
import { NodefileService } from './nodefile.service';

@Controller('nodefile')
export class NodefileController {
  constructor(private readonly nodefileService: NodefileService) {}

  @Get()
  async getNodeFile() {
    const data = await this.nodefileService.getNodeFile();
    console.log(data);
    return data;
  }
}
