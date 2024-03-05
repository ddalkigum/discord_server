import { inject, injectable } from 'inversify';
import { IUserService } from './interface';
import { TYPES } from '../../type';
import { IWinstonLogger } from '../../inrfastructure/logger/interface';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';

@injectable()
export default class UserService implements IUserService {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;

  public getUser = async (userId: string) => {
    const client = this.mongoClient.getClient();
    return await client.user.findUnique({ where: { id: userId } });
  }

  public createUser = async (email: string, password: string, nickname: string) => {
    const client = this.mongoClient.getClient();
    await client.user.create({ data: { email, password, nickname, createdAt: new Date(Date.now()) } });
  }

  public deleteUser = async (userId: string) => {
    const client = this.mongoClient.getClient();
    await client.user.delete({ where: { id: userId } });
  };
}