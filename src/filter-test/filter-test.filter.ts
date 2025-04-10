import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
@Catch()
export class FilterTestFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log('捕获到异常:', exception);

    if (exception instanceof BadRequestException) {
      const error = exception.getResponse();
      const message = Object.values(error);
      console.log('错误消息:', message);

      // 确保返回响应
      response.status(400).json({
        message: message,
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    // 处理其他类型的异常
    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: '服务器内部错误',
    });
  }
}
