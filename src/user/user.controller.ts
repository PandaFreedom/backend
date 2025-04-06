import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getUser() {
    return 'you Executed middleware！！！';
  }
  @Get('loginSvg')
  getLoginSvg(@Req() req, @Res() res) {
    console.log('Session in createUser:', req.session);
    return this.userService.createLoginSvg(req, res);
  }

  @Post('login')
  createUser(
    @Req() req,
    @Body() body: { username: string; password: string; captcha: string },
  ) {
    return this.userService.createUser(req, body);
  }
}
