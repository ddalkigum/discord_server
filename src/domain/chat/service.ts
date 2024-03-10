import { inject, injectable } from 'inversify';
import { IChatService } from './interface';
import { TYPES } from '../../type';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';
import { IWinstonLogger } from '../../inrfastructure/logger/interface';
import { ISocketServer } from '../../inrfastructure/server/socket';

@injectable()
export default class ChatService implements IChatService {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;
  @inject(TYPES.SocketServer) private socketServer: ISocketServer;

  public sendChat = async (serverId: string, channelId: string, senderId: string, content: string) => {
    this.logger.debug(`ChatService > sendChat, serverId: ${serverId}, channelId: ${channelId}, senderId: ${senderId}, content: ${content}`)
    const client = this.mongoClient.getClient();
    await client.chat.create({ data: { serverId, channelId, senderId, content, createdAt: new Date(Date.now()) } })

    this.socketServer.sendMessage(serverId, channelId, content);
  }

  public getChatHistory = async (serverId: string, channelId: string) => {
    this.logger.debug(`ChatService > sendChat, serverId: ${serverId}, channelId: ${channelId}`)
    const client = this.mongoClient.getClient();
    const chatHistory = await client.channel.findFirst({ include: { chats: true }, where: { serverId, id: channelId } })
    return chatHistory.chats
  }
}