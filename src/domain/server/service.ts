import { inject, injectable } from 'inversify';
import { IServerService, ServerType } from './interface';
import { TYPES } from '../../type';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';
import { IWinstonLogger } from '../../inrfastructure/logger/interface';

@injectable()
export default class ServerService implements IServerService {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;

  public getParticipateServer = async (userId: string) => {
    this.logger.debug(`ServerService > getParticipateServer, userId: ${userId}`)
    const client = this.mongoClient.getClient()
    const result = await client.participate.findMany({ where: { userId }, include: { server: true } });
    console.log(result);
    return result;
  };

  public participateServer = async (userId: string, serverId: string) => {

  };

  public createServer = async (ownerId: string, name: string, type: ServerType) => {
    this.logger.debug(`ServerService > createServer, ownerId: ${ownerId}, name: ${name}, type: ${type}`)
    const client = this.mongoClient.getClient();
    const createdServer = await client.server.create({ data: { name, type, ownerId, createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000) } });
    await client.participate.create({ data: { userId: ownerId, serverId: createdServer.id, createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000) } });
  };

  public deleteServer = async (userId: string, serverId: string) => {

  };


}