# 关于使用包 可以直接去 npmjs.or
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
