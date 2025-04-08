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
      console.log('error', error);
      const message = Object.values(error);
      console.log('message::: ', message);

      return new BadRequestException(message);
    }
  }
}
