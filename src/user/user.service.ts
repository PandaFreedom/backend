import { Body, Injectable, Req, Res, Session } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class UserService {
  // constructor(private readonly prisma: PrismaService) {}

  createLoginSvg(@Req() req, @Res() res) {
    const svg = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 120,
      height: 70,
    });

    // 存储验证码记录到session
    req.session.code = svg.text;
    console.log('session code', req.session.code);

    // 确保 session 被保存
    req.session.save((err) => {
      if (err) {
        console.error('保存session时出错:', err);
        res.status(500).send('服务器错误，无法保存验证码');
        return;
      }
      res.type('image/svg+xml');
      res.send(svg.data);
    });
  }

  async createUser(@Req() request, @Body() body) {
    console.log('web post data', body);
    console.log('session yes code?', request.session.code); // 直接使用 request.session

    // 添加安全检查，防止undefined引起错误
    if (!request.session || !request.session.code) {
      return {
        code: 400,
        message: '验证码已过期，请重新获取',
      };
    }

    // 使用前端传递的captcha字段与session中的code比较
    if (
      request.session.code.toLocaleLowerCase() ===
      body?.captcha?.toLocaleLowerCase()
    ) {
      return {
        code: 200,
        message: '验证码正确',
      };
    } else {
      return {
        code: 400,
        message: '验证码错误',
      };
    }
  }
}
