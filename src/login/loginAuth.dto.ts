import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsString({ message: '用户名不能为空' })
  name: string;
  @IsNotEmpty()
  @IsString({ message: '密码不能为空' })
  password: string;
}
