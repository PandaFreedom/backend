import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { LoginService } from './login.service';
import { LoginPipe } from './login.pipe';
import { LoginDto } from './login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('svg')
  async creactSvg(@Req() req: Request) {
    return this.loginService.creactSvg(req);
  }

  @Post('creactUser')
  @UsePipes(LoginPipe)
  async creactUser(@Body() body: LoginDto, @Req() req: Request) {
    return await this.loginService.creactUser(body, req);
  }

  @Post('userLogin')
  async userLogin(@Body() body, @Req() req: Request) {
    console.log('接收到的登录请求体:', body);
    // 这里可以实现登录逻辑
  }

  @Delete('deleteUser')
  async deleteUser(@Body() body) {
    return this.loginService.deleteUser(body);
  }
}
