import { ZooModule } from './zoo/zoo.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodefileModule } from './nodefile/nodefile.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { LoginModule } from './login/login.module';
import { PrismaService } from './db';
import { PipeModule } from './pipe/pipe.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ZooModule,
    NodefileModule,
    UserModule,
    UploadModule,
    LoginModule,
    PipeModule,
    LoginModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
