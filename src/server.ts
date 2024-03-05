import { PrismaClient } from '@prisma/client';
import { container } from './container';
import { IServer } from './inrfastructure/server/interface';
import { TYPES } from './type';

const server: IServer = container.get(TYPES.Server);
const prisma = new PrismaClient();

const start = async () => {
  try {
    await prisma.$connect();
    console.log('============== Mongo connected ==============')
    server.setServer();
    server.start('3001');
  } catch (error) {
    throw Error(error);
  }
}

start();

process
  .once('SIGTERM', async () => {
    await prisma.$disconnect();
    console.log('============== Mongo disconnected ==============')
    server.exit;
  }).once('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('============== Mongo disconnected ==============')
    server.exit;
  });
