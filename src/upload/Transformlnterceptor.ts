import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 统一接口响应格式拦截器
 * 所有接口返回的数据都会被包装成统一格式
 */
@Injectable()
export class Transformlnterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();
    return next.handle().pipe(
      map((data) => {
        const duration = Date.now() - startTime;
        new Logger().log(
          `接口耗时: ${duration}ms, url: ${request.url}, method: ${request.method}`,
        );
        // 统一返回格式
        return {
          success: true,
          code: 200,
          message: '请求成功',
          data,
          timestamp: Date.now(),
          path: request.url,
        };
      }),
    );
  }
}
