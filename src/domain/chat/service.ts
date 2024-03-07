import { inject, injectable } from 'inversify';
import { IChatService } from './interface';
import { TYPES } from '../../type';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';
import { IWinstonLogger } from '../../inrfastructure/logger/interface';
import { User } from '@prisma/client';

@injectable()
export default class ChatService implements IChatService {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;

  public sendChat = async (serverId: string, channelId: string, senderId: string, content: string) => {
    const client = this.mongoClient.getClient();
    await client.chat.create({ data: { serverId, channelId, senderId, content, createdAt: new Date(Date.now()) } })
  }

  public getChatHistory = async (serverId: string, channelId: string) => {
    const client = this.mongoClient.getClient();
    const chatHistory = await client.channel.findFirst({ include: { chats: true }, where: { serverId, id: channelId } })
    return chatHistory.chats
  }
}