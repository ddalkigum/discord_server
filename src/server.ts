import { PrismaClient } from '@prisma/client';
import { container } from './container';
import { IExpressServer } from './inrfastructure/server/interface';
import { TYPES } from './type';
import { IMongoClient } from './inrfastructure/database/mongo/interface';
import { ISocketServer } from './inrfastructure/server/socket';

const server: IExpressServer = container.get(TYPES.ExpressServer);
const mongoClient: IMongoClient = container.get(TYPES.MongoClient)
const socketServer: ISocketServer = container.get(TYPES.SocketServer);

const start = async () => {
  try {
    await mongoClient.init();
    const expressServer = server.getServer();
    socketServer.init(expressServer);

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
