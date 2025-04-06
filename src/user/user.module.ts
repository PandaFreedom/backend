import {
  Module,
  RequestMethod,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MiddlewareMiddleware } from 'src/middleware/middleware.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MiddlewareMiddleware).forRoutes({
      path: '/api/user',
      method: RequestMethod.ALL,
    });
  }
}
