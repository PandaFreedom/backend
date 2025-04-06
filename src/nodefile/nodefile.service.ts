import { Injectable } from '@nestjs/common';
import * as path from 'path'; // 导入 path 模块

@Injectable()
export class NodefileService {
  constructor() {}

  async getNodeFile() {
    try {
      const config = {
        path: path.resolve(__dirname, '../data'), // 获取文件路径
      };
      console.log('config::: ', config.path);
      return config;
    } catch (error) {
      console.error('Error resolving path:', error);
      throw new Error('Failed to get node file configuration');
    }
  }
}
