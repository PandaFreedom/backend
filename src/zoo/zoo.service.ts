import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db';

@Injectable()
export class ZooService {
  constructor(private readonly prisma: PrismaService) {}

  async createZooData(name: string, age: number) {
    if (!name || age <= 0) {
      throw new Error('Invalid input name or age type');
    }
    const zooData = await this.prisma.zoo.create({
      data: {
        name,
        age,
      },
    });

    return zooData;
  }

  async deleteZooData(id: number) {
    await this.prisma.zoo.delete({
      where: {
        id,
      },
    });
  }

  async SHowZooData() {
    return await this.prisma.zoo.findMany();
  }
}
