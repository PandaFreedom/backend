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
import { LoginDto } from './login.dto';
import { LoginPipe } from './login.pipe';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('svg')
  async CreactSvg(@Req() req: Request) {
    const svgData = await this.loginService.creactSvg(req);
    return svgData;
  }

  @Post('creactUser')
  // @UsePipes(LoginPipe) 可注释因为管道已经注册到main.ts中
  async creactUser(@Body() body: LoginDto, @Req() req: Request) {
    return this.loginService.creactUser(body, req);
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
