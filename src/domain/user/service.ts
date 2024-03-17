import { inject, injectable } from 'inversify';
import { IUserService } from './interface';
import { TYPES } from '../../type';
import { IWinstonLogger } from '../../inrfastructure/logger/interface';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';
import ErrorGenerator from '../common/error';

@injectable()
export default class UserService implements IUserService {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;

  public getUser = async (userId: string) => {
    const client = this.mongoClient.getClient();
    const foundUser = await client.user.findUnique({ where: { id: userId } });

    if (!foundUser) throw ErrorGenerator.badRequest('Does not exist user');

    return {
      id: foundUser.id,
      email: foundUser.email,
      nickname: foundUser.nickname,
      createdAt: foundUser.createdAt,
    }
  }

  public findUser = async (nickname: string) => {
    this.logger.debug(`UserService > findUser, nickname: ${nickname}`)
    const client = this.mongoClient.getClient();
    const foundUserList = await client.user.findMany({
      where: { nickname: { contains: nickname } },
      select: { id: true, nickname: true, createdAt: true }
    });
    return foundUserList;
  }

  public deleteUser = async (userId: string) => {
    const client = this.mongoClient.getClient();
    await client.user.delete({ where: { id: userId } });
  };
}