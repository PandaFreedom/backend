import { LoginDto } from './login';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { Request } from 'express';
import { PrismaService } from 'src/db';
import * as svgCaptcha from 'svg-captcha';
import type { LoginAuthDto } from './loginAuth.dto';

/**
 * 用户类型定义
 * 用于传递用户信息
 */
type User = {
  id?: number; // 用户ID，可选
  username: string; // 用户名
  password?: string; // 密码，可选
  confirmPassword?: string; // 确认密码，可选
  svgText?: string; // 验证码文本，可选
};

/**
 * 登录服务
 * 处理认证业务逻辑
 */
@Injectable()
export class LoginService {
  /**
   * 构造函数
   * @param prisma Prisma服务实例，用于数据库操作
   * @param jwtService JWT服务实例，用于生成和验证令牌
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证JWT令牌
   * @param token JWT令牌
   * @returns 解码后的用户信息
   * @throws UnauthorizedException 如果令牌无效或已过期
   */
  async verifyToken(token: string) {
    try {
      // 验证令牌并解码
      const decoded = await this.jwtService.verifyAsync(token);

      // 检查解码后的数据中是否包含用户ID
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('无效令牌格式');
      }

      // 从数据库中查找用户，确认用户存在
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true }, // 只选择安全字段，不包括密码
      });

      // 如果用户不存在，则令牌无效
      if (!user) {
        throw new UnauthorizedException('令牌对应的用户不存在');
      }

      // 返回用户信息（不包含敏感数据）
      return {
        id: user.id,
        username: user.name,
      };
    } catch (error) {
      console.error('令牌验证失败:', error.message);

      // 根据错误类型返回合适的异常
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('令牌已过期');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('无效的令牌');
      } else {
        throw new UnauthorizedException('令牌验证失败');
      }
    }
  }

  /**
   * 创建SVG验证码
   * @param req Express请求对象，用于存储验证码到会话
   * @returns 返回SVG验证码数据
   */
  async creactSvg(req: Request) {
    // 创建验证码，配置验证码参数
    const svg = svgCaptcha.create({
      size: 4, // 验证码长度‰
      fontSize: 50, // 字体大小
      width: 120, // 宽度
      height: 70, // 高度
      ignoreChars: '0oO1ilI', // 排除容易混淆的字符
      color: true, // 启用彩色
      background: '#cc9966', // 背景色
    });

    // 存储验证码到会话
    req.session['svg'] = svg.text;

    // 打印调试信息
    console.log('服务层生成的验证码:', svg.text);
    console.log('session对象:', req.session);
    console.log('session["svg"]:', req.session['svg']);

    // 显式保存会话以确保验证码被正确存储
    await new Promise<void>((resolve) => {
      req.session.save(() => {
        console.log('Session 已保存');
        resolve();
      });
    });

    return svg.data; // 返回SVG数据
  }

  /**
   * 创建用户（注册）
   * @param body 登录DTO，包含用户名、密码、验证码等信息
   * @param req Express请求对象，用于验证会话中的验证码
   * @returns 注册结果，包含成功状态、消息和令牌等信息
   */
  async creactUser(body: LoginDto, req: Request) {
    // 打印调试信息
    console.log('服务层接收到的session对象:', req.session);
    console.log('服务层接收到的验证码:', req.session['svg']);
    console.log('用户提交的验证码:', body.svgText);

    // 检查验证码是否过期
    if (!req.session['svg']) {
      return { success: false, message: '验证码已过期，请重新获取' };
    }

    // 验证验证码
    if (body.svgText.toLowerCase() === req.session['svg'].toLowerCase()) {
      // 验证码正确，创建用户
      const creactUser = await this.prisma.user.create({
        data: {
          name: body.username,
          password: await hash(body.password), // 使用argon2加密密码
          copyPassword: body.password,
        },
      });

      // 生成JWT令牌
      const token = this.generateToken({
        id: creactUser.id,
        username: creactUser.name,
      });

      // 返回成功响应
      return {
        success: true,
        message: '注册成功',
        code: 200,
        token: token,
        id: creactUser.id,
        username: creactUser.name,
      };
    } else {
      // 验证码错误
      return { success: false, message: '验证码错误', code: 400 };
    }
  }

  /**
   * 删除用户
   * @param id 要删除的用户ID
   * @returns 删除结果
   */
  async deleteUser(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return { success: true, message: '删除成功', data: user };
  }

  /**
   * 根据用户名查找用户
   * @param body 包含用户名和密码的登录信息对象
   * @returns 查询到的用户信息或错误信息
   */
  async findUserByUsername(body: LoginAuthDto) {
    console.log('body.name', body.name);

    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: {
        name: body.name,
      },
    });

    // 检查用户是否存在
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 验证密码
    if (!(await verify(user.password, body.password))) {
      throw new UnauthorizedException('密码错误');
    } else {
      delete user.copyPassword;
      console.log('用户验证成功:', user);
    }

    // 返回用户信息（可以排除敏感信息如密码）
    const { password, ...result } = user;
    return result;
  }

  /**
   * 生成JWT令牌
   * @param param0 包含用户名和ID的对象
   * @returns 生成的JWT令牌
   */
  async generateToken({ username, id }: User) {
    const token = await this.jwtService.signAsync({ username, sub: id });
    console.log('生成的token:', token);
    return token;
  }

  /**
   * 处理用户登录
   * @param body 请求体数据
   * @param query 查询参数
   * @returns 登录结果，包含成功状态、消息、用户信息和令牌
   * process 过程
   */
  async processLogin(body: any, query: any) {
    try {
      // 合并查询参数和请求体
      const loginData = {
        name: body.name || query.name,
        password: body.password || query.password,
      };

      // 验证数据完整性
      if (!loginData.name || !loginData.password) {
        throw new UnauthorizedException('用户名和密码不能为空');
      }

      console.log('处理后的登录数据 (用户名):', loginData.name);

      // 验证用户
      const user = await this.findUserByUsername(loginData);

      // 生成令牌
      const token = await this.generateToken({
        id: user.id,
        username: user.name,
      });

      // 返回成功响应
      return {
        success: true,
        message: '登录成功',
        code: 200,
        user,
        token,
      };
    } catch (error) {
      // 记录错误但不暴露详细信息
      console.error('登录处理失败:', error.message);

      // 将错误转换为适当的异常
      if (error instanceof UnauthorizedException) {
        throw error; // 直接重新抛出认证异常
      }

      // 其他错误转换为通用错误
      throw new UnauthorizedException('登录失败，请检查您的凭据');
    }
  }
}
