import { PrismaClient } from '@prisma/client';
import { container } from './container';
import { IServer } from './inrfastructure/server/interface';
import { TYPES } from './type';
import { IMongoClient } from './inrfastructure/database/mongo/interface';

const server: IServer = container.get(TYPES.Server);
const mongoClient: IMongoClient = container.get(TYPES.MongoClient)

const start = async () => {
  try {
    await mongoClient.init();
    server.setServer();
    server.start('3001');
  } catch (error) {
    throw Error(error);
  }
}

start();

process
  .once('SIGTERM', async () => {
    await mongoClient.exit();
    server.exit();
  }).once('SIGINT', async () => {
    await mongoClient.exit();
    server.exit();
  });
