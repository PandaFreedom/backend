import { PrismaClient } from '@prisma/client';
import * as Mock from 'mockjs';
const prisma = new PrismaClient();
const Random = Mock.Random;

const clearUsers = async () => {
  await prisma.user.deleteMany(); // 清空用户表
  console.log('用户表已清空');
};

const createUsers = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const user = await prisma.user.create({
      data: {
        email: Random.email(),
        name: Random.cname(),
        password: Random.string(6, 10),
      },
    });
    console.log('user', user);
  }
};

const renderCount = 20;

const seedDatabase = async () => {
  await clearUsers(); // 先清空用户表
  await createUsers(renderCount); // 然后渲染用户
};

seedDatabase();
