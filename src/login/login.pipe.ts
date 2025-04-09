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

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints)
          : [];
        return {
          property: error.property,
          messages: constraints,
        };
      });
      throw new BadRequestException(errorMessages);
    }
    // 返回验证通过的对象
    return object;
  }
}
