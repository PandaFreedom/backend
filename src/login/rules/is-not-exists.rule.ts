import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { PrismaService } from 'src/db';

export function IsLongerThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property], // 这是一个 自定义的 验证器
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const prisma = new PrismaService();
          const user = await prisma.user.findFirst({
            where: {
              [propertyName]: args.value,
            },
          });
          console.log('user::: ', user);
          return !user;
        },
      },
    });
  };
}
