import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// LoginPipe用于处理登录请求的数据转换和验证
@Injectable()
export class LoginPipe implements PipeTransform {
  // transform方法用于将输入值转换为指定类型并进行验证
  async transform(value: any, metadata: ArgumentMetadata) {
    // 将输入值转换为指定的类实例
    const object = plainToInstance(metadata.metatype, value);
    // 验证转换后的对象
    const errors = await validate(object);
    console.log('errors::: ', errors);
    const errorMessage = errors.map((error) => {
      return Object.values(error.constraints).join(',');
    });
    console.log('errorMessage', errorMessage);
    // 如果存在验证错误，抛出BadRequestException
    if (errors.length > 0) {
      throw new BadRequestException(errorMessage);
    }
    // 返回验证通过的对象
    return object;
  }
}
