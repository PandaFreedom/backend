# NestJS 认证系统实现文档

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
 对应掘金地址:<a href="https://juejin.cn/post/7494546904756715554">掘金文章:<br>
   <img src="https://lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg" alt="稀土掘金" class="logo-img" data-v-13e20730="">
 </a>


## 目录
- [NestJS 认证系统实现文档](#nestjs-认证系统实现文档)
  - [目录](#目录)
  - [项目概述](#项目概述)
  - [技术栈](#技术栈)
  - [核心组件](#核心组件)
    - [管道 (Pipe)](#管道-pipe)
      - [什么是管道？](#什么是管道)
      - [常用的内置管道](#常用的内置管道)
      - [使用示例](#使用示例)
      - [为什么需要管道？](#为什么需要管道)
      - [自定义登录管道实现](#自定义登录管道实现)
      - [使用方式](#使用方式)
    - [JWT认证](#jwt认证)
      - [JWT 的主要用途](#jwt-的主要用途)
      - [配置JWT模块](#配置jwt模块)
      - [生成JWT令牌](#生成jwt令牌)
      - [前端存储和使用JWT令牌](#前端存储和使用jwt令牌)
    - [异常过滤器 (Exception Filter)](#异常过滤器-exception-filter)
      - [实现](#实现)
      - [注册全局异常过滤器](#注册全局异常过滤器)
    - [验证码实现](#验证码实现)
      - [验证码生成](#验证码生成)
      - [验证码校验](#验证码校验)
  - [实现流程](#实现流程)
    - [用户注册流程](#用户注册流程)
    - [用户登录流程](#用户登录流程)
  - [数据传输对象 (DTO)](#数据传输对象-dto)
    - [注册DTO](#注册dto)
    - [登录DTO](#登录dto)
  - [前后端交互](#前后端交互)
    - [前端发送请求](#前端发送请求)
    - [后端响应格式](#后端响应格式)
  - [最佳实践](#最佳实践)
  - [常见问题与排查：JWT认证401错误](#常见问题与排查jwt认证401错误)
    - [现象描述](#现象描述)
    - [问题分析](#问题分析)
    - [解决方案](#解决方案)
    - [经验教训](#经验教训)
  - [前端路由守卫](#前端路由守卫)
    - [客户端路由保护](#客户端路由保护)
    - [认证状态管理](#认证状态管理)
    - [注销功能](#注销功能)
  - [文件上传](#文件上传)
    - [1. 模块配置](#1-模块配置)
    - [2. 自定义装饰器](#2-自定义装饰器)
    - [3. 控制器用法](#3-控制器用法)
    - [4. 接口说明](#4-接口说明)
    - [5. 返回值说明](#5-返回值说明)
    - [6. 前端/ApiFox 调用示例](#6-前端apifox-调用示例)
      - [ApiFox 配置](#apifox-配置)
      - [fetch 示例](#fetch-示例)
    - [7. 常见问题](#7-常见问题)
    - [8. 进阶用法](#8-进阶用法)

## 项目概述

本项目实现了一个完整的用户认证系统，包括用户注册、登录、验证码生成和JWT令牌管理。系统使用NestJS框架作为后端，React（Next.js）作为前端，实现了安全可靠的用户身份验证。

## 技术栈

- **后端**：NestJS、Prisma ORM、JWT、argon2（密码加密）
- **前端**：React、Next.js、Ant Design、React Query
- **数据库**：PostgreSQL
- **其他**：svg-captcha（验证码生成）

## 核心组件

### 管道 (Pipe)

#### 什么是管道？

管道（Pipe）是 NestJS 中的一个重要概念，它主要用于：

1. 数据转换（Transformation）：
   - 将输入数据转换为所需的格式（如字符串转数字）
   - 确保数据类型的正确性

2. 数据验证（Validation）：
   - 验证输入数据是否符合业务规则
   - 如果数据无效，则抛出异常

#### 常用的内置管道

NestJS 提供了多个开箱即用的管道：

- ParseIntPipe：将字符串转换为整数
- ParseFloatPipe：将字符串转换为浮点数
- ParseBoolPipe：将字符串转换为布尔值
- ParseArrayPipe：将字符串转换为数组
- ParseUUIDPipe：验证是否为有效的 UUID
- ValidationPipe：基于类验证器的数据验证

#### 使用示例

```typescript
@Get(':id')
getTest(@Param('id', ParseIntPipe) id: number) {
    // id 已经被转换为 number 类型
    return id;
}
```

#### 为什么需要管道？

1. 安全性：通过管道可以确保接收到的数据符合预期格式，防止恶意输入
2. 代码简洁：避免在业务逻辑中编写重复的数据验证代码
3. 可复用性：自定义管道可以在整个应用程序中重复使用
4. 职责分离：将数据转换和验证逻辑与业务逻辑分离

#### 自定义登录管道实现

```typescript
// login.pipe.ts
@Injectable()
export class LoginPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // 将输入值转换为指定的类实例
    const object = plainToInstance(metadata.metatype, value);
    // 验证转换后的对象
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints)
          : [];
        return {
          property: error.property,
          messages: constraints,
        };
      });
      throw new BadRequestException(errorMessages);
    }
    // 返回验证通过的对象
    return object;
  }
}
```

#### 使用方式

在控制器中使用管道验证输入数据：

```typescript
@Post('creactUser')
@UsePipes(LoginPipe)
async creactUser(@Body() body: LoginDto, @Req() req: Request) {
  return await this.loginService.creactUser(body, req);
}
```

或在全局注册管道：

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe());
```

### JWT认证

JWT（JSON Web Token）是一种用于在网络应用中实现认证和授权的标准方法。它由三部分组成：头部（header），负载（payload）和签名（signature）。

1. 头部（Header）：包含了 JWT 的类型和使用的加密算法。
2. 负载（Payload）：包含了用户的身份信息和其他元数据。
3. 签名（Signature）：用于验证 JWT 的完整性和真实性。

#### JWT 的主要用途

- 认证：在用户登录后，服务器会生成一个 JWT 并将其返回给客户端，客户端可以在后续的请求中携带该 JWT 来验证用户的身份。
- 授权：服务器可以使用 JWT 中的信息来判断用户是否有权限访问特定的资源。

#### 配置JWT模块

```typescript
// login.module.ts
@Module({
  imports: [
    // 异步注册 JWT 模块
    JwtModule.registerAsync({
      inject: [ConfigService], // 注入 ConfigService 以获取配置
      global: true, // 将 JWT 模块设置为全局模块
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET'), // 从配置中获取令牌密钥
        signOptions: { expiresIn: '1h' }, // 设置令牌过期时间为 1 小时
      }),
    }),
  ],
  providers: [LoginService, PrismaService, LoginPipe], // 提供服务和管道
})
export class LoginModule {}
```

#### 生成JWT令牌

```typescript
// login.service.ts
async generateToken({ username, id }: User) {
  const token = await this.jwtService.signAsync({ username, id });
  return token;
}
```

#### 前端存储和使用JWT令牌

```javascript
// 存储令牌
localStorage.setItem('authToken', data.token);

// 使用令牌进行API请求
fetch('http://localhost:3001/api/protected-resource', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
})
```
![alt text](image.png)
### 异常过滤器 (Exception Filter)

异常过滤器用于处理应用程序中抛出的异常，提供统一的错误响应格式。

#### 实现

```typescript
// filter-test.filter.ts
@Catch()
export class FilterTestFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof BadRequestException) {
      const error = exception.getResponse();
      const message = Object.values(error);

      response.status(400).json({
        message: message,
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    // 处理其他类型的异常
    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: '服务器内部错误',
    });
  }
}
```

#### 注册全局异常过滤器

```typescript
// main.ts
app.useGlobalFilters(new FilterTestFilter());
```

### 验证码实现

验证码用于防止自动化脚本进行注册，提高系统安全性。

#### 验证码生成

```typescript
// login.service.ts
async creactSvg(req: Request) {
  // 创建验证码
  const svg = svgCaptcha.create({
    size: 4,             // 验证码长度
    fontSize: 50,        // 字体大小
    width: 120,          // 宽度
    height: 70,          // 高度
    ignoreChars: '0oO1ilI', // 排除容易混淆的字符
    color: true,         // 启用彩色
    background: '#cc9966', // 背景色
  });

  // 存储验证码到会话
  req.session['svg'] = svg.text;

  // 保存会话
  await new Promise<void>((resolve) => {
    req.session.save(() => {
      console.log('Session 已保存');
      resolve();
    });
  });

  return svg.data; // 返回SVG数据
}
```

#### 验证码校验

```typescript
// login.service.ts
// 在注册流程中验证验证码
if (body.svgText.toLowerCase() === req.session['svg'].toLowerCase()) {
  // 验证码正确，继续注册流程
} else {
  // 验证码错误
  return { success: false, message: '验证码错误', code: 400 };
}
```

## 实现流程

### 用户注册流程

1. **前端准备**：
   - 用户填写注册表单（用户名、密码、确认密码）
   - 请求并显示验证码
   - 用户填写验证码

2. **表单提交**：
   - 前端验证表单数据
   - 发送POST请求到 `/auth/creactUser` 端点
   - 包含用户名、密码、确认密码和验证码

3. **后端处理**：
   - 使用管道验证表单数据
   - 验证验证码是否正确
   - 使用argon2加密密码
   - 创建用户记录
   - 生成JWT令牌
   - 返回成功响应

4. **前端后续处理**：
   - 保存JWT令牌到localStorage
   - 显示成功消息
   - 跳转到仪表板页面

### 用户登录流程

1. **前端准备**：
   - 用户填写登录表单（用户名、密码）

2. **表单提交**：
   - 前端验证表单数据
   - 发送POST请求到 `/auth/login` 端点

3. **后端处理**：
   - 根据用户名查找用户
   - 验证用户是否存在
   - 验证密码是否正确
   - 生成JWT令牌
   - 返回成功响应

4. **前端后续处理**：
   - 保存JWT令牌到localStorage
   - 显示成功消息
   - 跳转到仪表板页面

## 数据传输对象 (DTO)

DTO用于定义API接口的数据结构，包括验证规则。

### 注册DTO

```typescript
// login.dto.ts
export class LoginDto {
  @IsNotEmpty()
  @IsLongerThan('username', { message: 'username is of repeat' })
  username: string;

  @IsEmail()
  email: string;

  @Length(8, 16, {
    message: 'password length must be between 8 and 16 characters',
  })
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Validate(IsConfirmedPassword)
  confirmPassword: string;

  @IsNotEmpty()
  svgText: string;
}
```

### 登录DTO

```typescript
// loginAuth.dto.ts
export class LoginAuthDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
```

## 前后端交互

### 前端发送请求

```javascript
// 注册请求
fetch('http://localhost:3001/auth/creactUser', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify(values),
})
.then((res) => res.json())
.then((data) => {
  if (data.success) {
    // 保存token
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('userId', data.id);

    // 跳转页面
    router.push('/dashboard');
  }
});

// 登录请求
fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    name: values.username,
    password: values.password
  }),
})
.then((res) => res.json())
.then((data) => {
  if (data.success) {
    // 保存token
    localStorage.setItem('authToken', data.token);
  }
});
```

### 后端响应格式

```json
// 成功响应
{
  "success": true,
  "message": "操作成功",
  "code": 200,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "username": "testuser"
}

// 错误响应
{
  "success": false,
  "message": "验证码错误",
  "code": 400
}
```

## 最佳实践

1. **密码安全**：
   - 使用argon2进行密码加密，比bcrypt更安全
   - 永远不要在数据库中存储明文密码
   - JWT令牌中不要包含敏感信息（如密码）

2. **错误处理**：
   - 使用异常过滤器统一处理错误
   - 返回友好的错误信息，但不暴露系统细节
   - 在关键位置添加try-catch块

3. **代码组织**：
   - 将业务逻辑放在服务层
   - 控制器只负责处理HTTP请求和响应
   - 使用DTO定义和验证数据结构

4. **安全考虑**：
   - 使用HTTPS传输敏感数据
   - 设置合理的令牌过期时间
   - 考虑使用刷新令牌机制
   - 实现CSRF保护

5. **前端处理**：
   - 存储令牌时考虑安全性（localStorage vs HttpOnly Cookie）
   - 实现令牌过期处理逻辑
   - 添加请求失败重试机制

通过以上实践，可以构建一个安全、可靠的用户认证系统，为应用程序提供良好的用户体验和安全保障。

## 常见问题与排查：JWT认证401错误

### 现象描述

- 登录接口能正常返回token，格式无误。
- 用Apifox等工具访问受保护接口（如 `/auth/all`），即使带上了token，依然返回401 Unauthorized。
- 后端日志有如下报错：

  ```
  Invalid `this.prisma.user.findUnique()` invocation...
  Argument `where` of type UserWhereUniqueInput needs at least one of `id` or `name` arguments.
  ...
  async validate({ sub: id }) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  ```

### 问题分析

- 生成JWT token时，payload写的是 `{ username, id }`，**没有把id放到sub字段**。
- JwtStrategy（jstStrategy.ts）里，`validate({ sub: id })` 期望token里有`sub`字段。
- 结果：`id` 变成了 `undefined`，Prisma查数据库时报错，导致认证失败，返回401。

### 解决方案

- **推荐做法**：生成token时，payload写成 `{ username, sub: id }`，这样JwtStrategy能正确解构出id。
  ```js
  // 正确写法
  const token = await this.jwtService.signAsync({ username, sub: id });
  ```
- 或者，直接在validate方法里用`payload.id`，兼容你原来的token结构。
  ```js
  async validate(payload: any) {
    return this.prisma.user.findUnique({
      where: { id: payload.id },
    });
  }
  ```

### 经验教训

- JWT认证时，token的payload结构要和后端解构方式严格一致。
- 认证失败时，优先看后端日志，尤其是validate方法和数据库查询的报错。
- Authorization头必须严格为`Bearer <token>`格式。

## 前端路由守卫

为了确保只有已认证的用户才能访问受保护的页面，我们实现了前端路由守卫机制。

### 客户端路由保护

我们使用React组件包装需要保护的页面，实现了客户端路由保护：

```tsx
// src/app/components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查用户是否已认证
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        // 未找到token，重定向到登录页
        router.push('/login');
      } else {
        // 找到token，设置认证状态
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // 显示加载状态或已认证的内容
  if (isLoading) return <div>加载中...</div>;
  if (isAuthenticated) return <>{children}</>;
  return null;
}
```

使用方式：

```tsx
// 在需要保护的页面中使用
function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>仪表板内容</div>
    </ProtectedRoute>
  );
}
```

### 认证状态管理

为了方便管理认证状态，我们创建了认证工具函数：

```ts
// src/app/utils/auth.ts

// 保存用户认证信息
export const saveAuth = (token, username, userId) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('username', username);
  localStorage.setItem('userId', userId);
};

// 检查用户是否已认证
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('authToken');
  return !!token;
};

// 获取用户信息
export const getUserInfo = () => {
  if (typeof window === 'undefined') return { username: '', userId: '' };
  return {
    username: localStorage.getItem('username') || '',
    userId: localStorage.getItem('userId') || '',
  };
};

// 清除用户认证信息
export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
};
```

### 注销功能

我们实现了注销功能，让用户可以安全地退出系统：

```tsx
// src/app/components/LogoutButton.tsx
"use client";

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { clearAuth } from '../utils/auth';

export default function LogoutButton({ className }) {
  const router = useRouter();

  const handleLogout = () => {
    // 清除认证信息
    clearAuth();

    // 跳转到登录页
    router.push('/login');
  };

  return (
    <Button
      danger
      type="primary"
      onClick={handleLogout}
      className={className}
    >
      退出登录
    </Button>
  );
}
```

通过以上实现，我们建立了一个完整的前端认证体系，包括：

1. 路由保护：确保只有已认证的用户才能访问受保护页面
2. 认证状态管理：集中管理用户认证信息和状态
3. 注销功能：安全地退出系统
4. 用户体验：加载状态显示和友好的错误提示

这些功能与后端的JWT认证系统无缝集成，提供了完整的用户认证解决方案。

## 文件上传

本项目支持通过 NestJS + Multer 实现图片/文件上传，支持自定义文件类型、大小等限制，并通过自定义装饰器简化上传接口的开发。

### 1. 模块配置

```typescript
// upload.module.ts
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        // 文件存储路径
        destination: './uploads',
        // 文件名格式：原始文件名-当前时间戳.文件扩展名
        filename: (req, file, callback) => {
          const fileName = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.').pop();
          return callback(null, `${fileName}-${Date.now()}.${fileExtension}`);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
```

---

### 2. 自定义装饰器

为了让上传接口更简洁、易维护，项目封装了 `@Upload()` 装饰器：

```typescript
// uploda.decorator.ts
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export function Upload(type: 'image' | 'file', options?: any) {
  return applyDecorators(UseInterceptors(FileInterceptor(type, options)));
}
```

---

### 3. 控制器用法

```typescript
// upload.controller.ts
import { Controller, Post, UploadedFile, BadRequestException } from '@nestjs/common';
import { Upload } from './decorator/uploda.decorator';

@Controller('upload')
export class UploadController {
  @Post('image')
  @Upload('image', {
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter(req, file, callback) {
      if (file.mimetype.includes('image')) {
        callback(null, true);
      } else {
        callback(new BadRequestException('文件类型不支持'), false);
      }
    },
  })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file.filename) {
      return {
        success: true,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: '文件内容已接收',
      };
    }
    return { success: true, filename: file.filename };
  }
}
```

---

### 4. 接口说明

- **接口地址**：`POST /upload/image`
- **请求类型**：`multipart/form-data`
- **参数说明**：

| 参数名 | 类型   | 必填 | 说明           |
| ------ | ------ | ---- | -------------- |
| image  | 文件   | 是   | 上传的图片文件 |

- **限制**：
  - 文件大小 ≤ 5MB
  - 仅支持图片类型（`image/*`）

---

### 5. 返回值说明

- **成功响应**：

```json
{
  "success": true,
  "filename": "yourfile-1713240000000.png"
}
```

- **失败响应**：

```json
{
  "statusCode": 400,
  "message": "文件类型不支持",
  "error": "Bad Request"
}
```

---

### 6. 前端/ApiFox 调用示例
<image src="./自定义装饰器.png">

#### ApiFox 配置

- 请求方式：POST
- Body 类型：form-data
- 参数名：`image`，类型选择"文件"，选择本地图片

#### fetch 示例

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3001/upload/image', {
  method: 'POST',
  body: formData,
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('上传成功，文件名：' + data.filename);
    } else {
      alert('上传失败：' + data.message);
    }
  });
```

---

### 7. 常见问题

- **字段名必须为 `image`**，否则会报 `Unexpected field` 错误。
- 文件大小超限或类型不符会被拒绝，返回 400 错误。
- 上传目录 `./uploads` 必须存在且有写入权限。

---

### 8. 进阶用法

如需上传其他类型文件或多个文件，可参考 NestJS 官方文档，或扩展自定义装饰器。

---
