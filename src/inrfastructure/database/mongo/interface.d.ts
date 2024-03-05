import { PrismaClient } from '@prisma/client';

export interface IMongoClient {
  init: () => Promise<void>;
  getClient: () => PrismaClient;
  exit: () => Promise<void>;
}