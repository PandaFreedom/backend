import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { PrismaService } from 'src/db';
import { LoginPipe } from './login.pipe';

@Module({
  controllers: [LoginController],
  providers: [LoginService, PrismaService, LoginPipe],
})
export class LoginModule {}
