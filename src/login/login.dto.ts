import {
  IsEmail,
  IsNotEmpty,
  Length,
  Validate,
  IsOptional,
} from 'class-validator';
import { IsConfirmedPassword } from './rules/is-confirmed_password.rule';
import { IsLongerThan } from './rules/is-not-exists.rule';
export class LoginDto {
  @IsNotEmpty()
  @IsLongerThan('name', { message: 'Username already exists' }) // 修改为name
  username: string;
  @IsEmail()
  @IsOptional() // 添加此装饰器使email变为可选
  email?: string;
  @Length(8, 16, {
    message: 'password length must be between 8 and 16 characters',
  })
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @Validate(IsConfirmedPassword)
  confirmPassword: string;
  @IsNotEmpty()
  svgText: string;
}
// my diy of is confirmed password
// import {
//   ValidationArguments,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';

// 自定义验证器，用于验证确认密码是否与原密码一致
// @ValidatorConstraint()
// export class IsConfirmedPassword implements ValidatorConstraintInterface {
// validate方法用于验证输入的值
//   async validate(value: any, args: ValidationArguments) {
// 获取原密码的值
//     console.log(args);
// 返回验证结果，检查确认密码是否与原密码一致
//     return false;
//   }

// 默认错误消息
//   defaultMessage(validationArguments?: ValidationArguments): string {
//     console.log('validationArguments', validationArguments);
//     return '密码不一致 比对失败';
//   }
// }
