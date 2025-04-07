import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class LoginDto {
  @IsEmail()
  email: string;
  @Length(8, 16)
  @IsNotEmpty()
  password: string;
}
