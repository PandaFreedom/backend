import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
