import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
@Catch()
export class FilterTestFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log('捕获到异常:', exception);

    // 处理各种类型的异常
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      // 处理非 HTTP 异常
      response.status(500).json({
        statusCode: 500,
        message: '服务器内部错误',
        error:
          exception instanceof Error ? exception.message : String(exception),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
