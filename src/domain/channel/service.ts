import { inject, injectable } from 'inversify';
import { IChannelService } from './interface';
import { TYPES } from '../../type';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';

@injectable()
export default class ChannelService implements IChannelService {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;

  public getAllChannel = async (serverId: string) => {
    const client = this.mongoClient.getClient();
    return await client.channel.findMany({ where: { serverId } });
  }

  public createChannel = async (serverId: string, userId: string, type: string = 'community', channelName: string) => {
    const client = this.mongoClient.getClient();
    await client.channel.create({ data: { serverId, ownerId: userId, type, name: channelName, createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000) } });
  };

  updateChannel: (serverId: string, userId: string, channelId: string) => Promise<any>;
  deleteChannel: (serverId: string, userId: string, chnnelId: string) => Promise<void>;
}