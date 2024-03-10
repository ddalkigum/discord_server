import { inject, injectable } from 'inversify';
import { IChannelService } from './interface';
import { TYPES } from '../../type';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';
import { ISocketServer } from '../../inrfastructure/server/socket';
import { IWinstonLogger } from '../../inrfastructure/logger/interface';

@injectable()
export default class ChannelService implements IChannelService {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;
  @inject(TYPES.SocketServer) private socketServer: ISocketServer;

  public getAllChannel = async (serverId: string) => {
    const client = this.mongoClient.getClient();
    return await client.channel.findMany({ where: { serverId } });
  }

  public createChannel = async (serverId: string, userId: string, type: string = 'community', channelName: string) => {
    const client = this.mongoClient.getClient();
    await client.channel.create({ data: { serverId, ownerId: userId, type, name: channelName, createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000) } });
  };

  public connectChannel = async (serverId: string, channelId: string) => {
    this.logger.debug(`ChannelService > connectChannel, serverId: ${serverId}, channelId: ${channelId}`);
    this.socketServer.connectChannel(serverId, channelId);
  }

  updateChannel: (serverId: string, userId: string, channelId: string) => Promise<any>;
  deleteChannel: (serverId: string, userId: string, chnnelId: string) => Promise<void>;
}