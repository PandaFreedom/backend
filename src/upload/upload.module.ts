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
        // 文件名
        filename: (req, file, callback) => {
          // 文件名格式：原始文件名-当前时间戳.文件扩展名
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
