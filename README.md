<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Pipe (管道)

## 什么是管道？

管道（Pipe）是 NestJS 中的一个重要概念，它主要用于：

1. 数据转换（Transformation）：
   - 将输入数据转换为所需的格式（如字符串转数字）
   - 确保数据类型的正确性

2. 数据验证（Validation）：
   - 验证输入数据是否符合业务规则
   - 如果数据无效，则抛出异常

## 常用的内置管道

NestJS 提供了多个开箱即用的管道：

- ParseIntPipe：将字符串转换为整数
- ParseFloatPipe：将字符串转换为浮点数
- ParseBoolPipe：将字符串转换为布尔值
- ParseArrayPipe：将字符串转换为数组
- ParseUUIDPipe：验证是否为有效的 UUID
- ValidationPipe：基于类验证器的数据验证

## 使用示例

```typescript
@Get(':id')
getTest(@Param('id', ParseIntPipe) id: number) {
    // id 已经被转换为 number 类型
    return id;
}
```

## 为什么需要管道？

1. 安全性：通过管道可以确保接收到的数据符合预期格式，防止恶意输入
2. 代码简洁：避免在业务逻辑中编写重复的数据验证代码
3. 可复用性：自定义管道可以在整个应用程序中重复使用
4. 职责分离：将数据转换和验证逻辑与业务逻辑分离

### my diy Pipe

-------use method! 先定义管道，在控制器中使用，然后在 pipe配置，我们可以用到 class-transformer 和 class-validator 来进行数据转换和验证。

```typescript
// login.pipe.ts
import { IsNotEmpty, Length } from 'class-validator';
export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @Length(8, 16, { message: '密码长度必须在8到16之间!!!' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

//
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// LoginPipe用于处理登录请求的数据转换和验证
@Injectable()
export class LoginPipe implements PipeTransform {// transform方法用于将输入值转换为指定类型并进行验证
  async transform(value: any, metadata: ArgumentMetadata) { // 将输入值转换为指定的类实例
    const object = plainToInstance(metadata.metatype, value);
    console.log('object 管道', object);// 验证转换后的对象
    const errors = await validate(object);
    console.log('errors', errors);// 如果存在验证错误，抛出BadRequestException
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }// 返回验证通过的对象
    return object;
  }}
// login.controller.ts
@Post('creactUser')
  async creactUser(@Body(new LoginPipe()) body: LoginDto, @Req() req: Request) {
    return this.loginService.creactUser(body, req);
  }
```
### nestjs 自带的全局管道方法

前端提交请求数据 ➡️ Pipe 拦截并转 DTO 校验 ➡️ 校验失败 ➡️ 抛出 BadRequestException ➡️ Filter 捕获并返回统一格式的错误信息
