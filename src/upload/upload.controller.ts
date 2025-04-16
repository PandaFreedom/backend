import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Upload } from './decorator/uploda.decorator';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('image')
  @UseInterceptors(FileInterceptor('file'))
  image(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @Post('image')
  @Upload('image', {
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
      fieldNameSize: 200, // 字段名最大长度
      fieldSize: 1024 * 1024 * 5, // 文件大小限制
      fields: 10, // 最多允许的非文件字段数
      parts: 10, // 最多允许的请求体部分数
    },
    fileFilter(req, file, callback) {
      if (file.mimetype.includes('image')) {
        callback(null, true);
      } else {
        callback(new BadRequestException('文件类型不支持'), false);
      }
    },
  })
  // 使用自定义 @Upload 装饰器，简化上传拦截器配置，实现参数解耦和复用。
  // 这样可以避免每次都手动写 @UseInterceptors(FileInterceptor(...))，让代码更简洁。
  // 如果需要未封装的原始写法，请参考 upload.decorator.ts 文件中的注释说明。
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    // 确保 file.filename 存在
    if (!file.filename) {
      console.error('文件上传成功但filename属性缺失：', file);
      // 返回其他可用信息
      return {
        success: true,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: '文件内容已接收', // 不返回实际buffer内容
      };
    }

    // 正常返回文件信息
    return { success: true, filename: file.filename };
  }
}
