import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { PrismaService } from 'src/db';
import { LoginPipe } from './login.pipe';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginController } from './login.controller';
import { JwtStrategy } from './jstStrategy';

// 定义 LoginModule 模块
@Module({
  imports: [
    // 异步注册 JWT 模块
    JwtModule.registerAsync({
      inject: [ConfigService], // 注入 ConfigService 以获取配置
      global: true, // 将 JWT 模块设置为全局模块
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET'), // 从配置中获取令牌密钥
        signOptions: { expiresIn: '1d' }, // 设置令牌过期时间为 1 天
      }),
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, PrismaService, LoginPipe, JwtStrategy], // 提供服务和管道
})
export class LoginModule {} // 导出 LoginModule 类
