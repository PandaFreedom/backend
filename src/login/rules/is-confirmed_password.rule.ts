import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// 自定义验证器，用于验证确认密码是否与原密码一致
@ValidatorConstraint()
export class IsConfirmedPassword implements ValidatorConstraintInterface {
  // validate方法用于验证输入的值
  async validate(value: any, args: ValidationArguments) {
    // 获取原密码的值
    const password = args.object['password'];
    return value === password; //如果他们相等 返回true 否则返回false
  }

  // 默认错误消息
  defaultMessage(validationArguments?: ValidationArguments): string {
    // console.log('validationArguments', validationArguments);
    return '密码不一致，比对失败';
  }
}
