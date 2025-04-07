import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { LoginPipe } from './login/login.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 添加cookie解析中间件
  app.use(cookieParser());

  // CORS配置要在session中间件之前
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'], // 允许的前端地址
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 允许携带凭证
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'], // 允许前端访问的响应头
  });
  // Session配置
  app.useGlobalPipes(new LoginPipe()); //注册方式
  app.use(
    session({
      secret: 'panda-session',
      resave: false,
      saveUninitialized: false,
      rolling: true, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认:false)
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1小时过期
        sameSite: 'lax',
        secure: false, // 开发环境中设置为 false
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
