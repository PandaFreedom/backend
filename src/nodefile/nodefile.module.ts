import { Module } from '@nestjs/common';
import { NodefileService } from './nodefile.service';
import { NodefileController } from './nodefile.controller';

@Module({
  controllers: [NodefileController],
  providers: [NodefileService],
  exports: [NodefileService],
})
export class NodefileModule {}
