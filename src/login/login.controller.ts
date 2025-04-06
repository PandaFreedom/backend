import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginService } from './login.service';
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('svg')
  async CreactSvg(@Req() req: Request) {
    const svgData = await this.loginService.creactSvg(req);
    return svgData;
  }

  @Post('creactUser')
  async creactUser(@Body() body, @Req() req: Request) {
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
