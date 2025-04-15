import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Post,
  Req,
  UsePipes,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from './login';
import { LoginPipe } from './login.pipe';
import { LoginService } from './login.service';
import { PrismaService } from '../db';
// import { AuthGuard } from '@nestjs/passport';
import { Auth } from './decorator/auth.decorator';
import { User } from './decorator/user.decorator';

/**
 * 认证控制器
 * 处理用户登录、注册、验证码生成等认证相关请求
 */
@Controller('auth')
export class LoginController {
  /**
   * 构造函数，注入登录服务
   * @param loginService 登录服务实例
   */
  constructor(
    private readonly loginService: LoginService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 生成 SVG 验证码
   * @param req Express 请求对象，用于存储验证码到会话
   * @returns 返回 SVG 验证码数据
   */
  @Get('svg')
  @Header('Content-Type', 'image/svg+xml') // 设置响应头为 SVG 格式
  async creactSvg(@Req() req: Request) {
    return this.loginService.creactSvg(req);
  }

  /**
   * 用户注册接口
   * @param body 包含用户名、密码、验证码等注册信息的 DTO
   * @param req Express 请求对象，用于验证会话中的验证码
   * @returns 注册结果，包含成功状态、消息和令牌等信息
   */
  @Post('creactUser')
  @UsePipes(LoginPipe) // 使用 LoginPipe 处理请求体
  async creactUser(@Body() body: LoginDto, @Req() req: Request) {
    return await this.loginService.creactUser(body, req);
  }

  /**
   * 用户登录接口
   * @param body 包含用户名和密码的请求体
   * @param query 包含查询参数
   * @param req Express 请求对象
   * @returns 登录结果，包含成功状态、消息、用户信息和令牌
   */
  @Post('login')
  async userLogin(@Body() body: any, @Query() query: any, @Req() req: Request) {
    // 记录原始请求数据
    console.log('原始请求数据 - 查询参数:', query);
    console.log('原始请求数据 - 请求体:', body);

    // 调用服务层方法处理登录
    return await this.loginService.processLogin(body, query);
  }

  /**
   * 删除用户接口
   * @param body 包含用户ID的请求体
   * @returns 删除结果
   */
  @Delete('deleteUser')
  async deleteUser(@Body() body) {
    return this.loginService.deleteUser(body);
  }

  /**
   * 测试生成令牌的接口
   * 使用固定的测试用户信息生成JWT令牌
   * @returns 包含生成的令牌或错误信息的响应
   */
  @Get('test')
  async test() {
    try {
      const token = await this.loginService.generateToken({
        username: 'test',
        password: 'test',
      });
      console.log('测试端点生成的token:', token);
      return { success: true, token };
    } catch (error) {
      console.error('生成token时出错:', error);
      return { success: false, error: error.message };
    }
  }
  @Get('all')
  // @UseGuards(AuthGuard('jwt'))
  @Auth()
  async getAll(@User() user: any) {
    console.log('user', user);
    return this.prisma.user.findMany();
  }
}
