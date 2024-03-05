import { inject, injectable } from 'inversify';
import { IServerService, ServerType } from './interface';
import { TYPES } from '../../type';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';

@injectable()
export default class ServerService implements IServerService {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;

  public getParticipateServer = async (userId: string) => {
    const client = this.mongoClient.getClient()
    return await client.participate.findMany({ where: { userId } });
  };

  public participateServer = async (userId: string, serverId: string) => {

  };

  public createServer = async (userId: string, name: string, type: ServerType) => {
    const client = this.mongoClient.getClient();
    await client.server.create({ data: { name, type, ownerId: userId, createdAt: new Date(Date.now()) } });
  };

  public deleteServer = async (userId: string, serverId: string) => {

  };


}