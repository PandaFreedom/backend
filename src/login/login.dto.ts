import { IsNotEmpty, Length, Validate } from 'class-validator';
import { IsConfirmedPassword } from './rules/is-confirmed_password.rule';
export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @Length(8, 16, { message: '密码长度必须在8到16之间!!!' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsNotEmpty({ message: '确认密码不能为空' })
  @Length(8, 16, { message: '密码长度必须在8到16之间!!!' })
  @Validate(IsConfirmedPassword)
  confirmPassword: string;
}
