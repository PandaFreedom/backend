import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { IsConfirmedPassword } from './rules/is-confirmed_password.rule';
import { IsLongerThan } from './rules/is-not-exists.rule';
export class LoginDto {
  @IsNotEmpty()
  @IsLongerThan('username', { message: 'your name is of repeat' }) // 自定义验证器
  username: string;
  @IsEmail()
  email: string;
  @Length(8, 16, { message: '密码长度必须在8到16个字符之间' })
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @Validate(IsConfirmedPassword)
  confirmPassword: string;
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
