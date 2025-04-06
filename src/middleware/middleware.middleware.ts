import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MiddlewareMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('middleware my of user module');
    res.send('中间件执行了'); //执行了 send 就相当于返回了 后面就不用写代码了
    next(); // 不写这个，请求会卡住
  }
}
