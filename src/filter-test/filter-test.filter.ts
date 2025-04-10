import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
@Catch()
export class FilterTestFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    if (exception instanceof BadRequestException) {
      const error = exception.getResponse();
      const message = Object.values(error);
      console.log('message::: ', message);
      // console.log('host', host);
      return new BadRequestException({
        message: message,
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: host.switchToHttp().getRequest().url,
      });
    }
  }
}
