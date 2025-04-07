import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LoginPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value', value); // 打印传入的值，便于调试
    const loginDto = plainToClass(LoginDto, value); // 将传入的值转换为 LoginDto 实例
    return loginDto; // 返回转换后的 DTO 实例
  }
}
