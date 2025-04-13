import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { Request } from 'express';
import { PrismaService } from 'src/db';
import { hash } from 'argon2';
import type { LoginDto } from './login.dto';

type User = {
  username: string;
  password: string;
  confirmPassword?: string;
  svgText?: string;
};
@Injectable()
export class LoginService {
  constructor(private readonly prisma: PrismaService) {}

  async creactSvg(req: Request) {
    const svg = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 120,
      height: 70,
      ignoreChars: '0oO1ilI',
      color: true,
      background: '#cc9966',
    });

    // 直接修改 req.session
    req.session['svg'] = svg.text;

    // console.log('服务层生成的验证码:', svg.text);
    // console.log('session对象:', req.session);
    // console.log('session["svg"]:', req.session['svg']);

    // 显式保存session
    await new Promise<void>((resolve) => {
      req.session.save(() => {
        // console.log('Session 已保存');
        resolve();
      });
    });

    return svg.data;
  }

  async creactUser(body: LoginDto, req: Request) {
    // console.log('服务层接收到的session对象:', req.session);
    // console.log('服务层接收到的验证码:', req.session['svg']);
    // console.log('用户提交的验证码:', body.svgText);
    if (!req.session['svg']) {
      return { success: false, message: '验证码已过期，请重新获取' };
    }

    if (body.svgText.toLowerCase() === req.session['svg'].toLowerCase()) {
      const user = await this.prisma.user.create({
        data: {
          name: body.username,
          password: await hash(body.password),
        },
      });
      return { success: true, message: '注册成功', data: user, code: 200 };
    } else {
      return { success: false, message: '验证码错误' };
    }
  }
  async deleteUser(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return { success: true, message: '删除成功', data: user };
  }
}
