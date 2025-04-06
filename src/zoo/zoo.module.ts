import { PrismaService } from 'src/db';
import { ZooController } from './zoo.controller';
import { ZooService } from './zoo.service';
import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ZooController],
  providers: [ZooService, PrismaService],
})
/**
 * ZooModule类实现了NestModule接口
 * 该类用于配置中间件
 */
export class ZooModule {}
