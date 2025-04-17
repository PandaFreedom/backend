import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export function Upload(type: 'image' | 'file', options?: any) {
  console.log(type, options);

  return applyDecorators(UseInterceptors(FileInterceptor(type, options)));
}
// @UseInterceptors(
//   FileInterceptor('image', {
//     limits: {
//       fileSize: 1024 * 1024 * 5, // 5MB
//       fieldNameSize: 200, // 字段名最大长度
//       fieldSize: 1024 * 1024 * 5, // 文件大小限制
//       fields: 10, // 最多允许的非文件字段数
//       parts: 10, // 最多允许的请求体部分数
//     },
//     fileFilter(req, file, callback) {
//       if (file.mimetype && file.mimetype.includes('image')) {
//         callback(null, true);
//       } else {
//         callback(new BadRequestException('文件类型不支持'), false);
//       }
//     },
//   }),
// )
export function UploadImage() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('image', {
        limits: {
          fileSize: 1024 * 1024 * 5, // 5MB
        },
      }),
    ),
  );
}
