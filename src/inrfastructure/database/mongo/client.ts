import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../type';
import { IWinstonLogger } from '../../logger/interface';

@injectable()
export default class MongoClient {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;

  private client: PrismaClient;

  public init = async () => {
    this.client = new PrismaClient();

    await this.client.$connect();
    this.logger.info('===== Mongo DB Connected =====')
  }

  public getClient = () => {
    return this.client;
  }

  public exit = async () => {
    await this.client.$disconnect();
    this.logger.info('===== Mongo DB Disonnected =====')
  }
}