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

  public createChatRoom = async (userId: string, participantId: string) => {
    this.logger.debug(`ChatService > createChatRoom, userId: ${userId}, participantId: ${participantId}`);
    const client = this.mongoClient.getClient();
    const user = await client.user.findFirst({ where: { id: userId } });
    const participant = await client.user.findFirst({ where: { id: participantId } });

    const chatRoom = await client.chatRoom.create({ data: { userNicknameList: [user.nickname, participant.nickname] } });
    await client.chatRoomParticipant.create({ data: { chatRoomId: chatRoom.id, userId } });
    await client.chatRoomParticipant.create({ data: { chatRoomId: chatRoom.id, userId: participantId } });
  }

  public getChatRoomList = async (userId: string) => {
    this.logger.debug(`ChatService > getChatRoomList, userId: ${userId}`);
    const client = this.mongoClient.getClient();
    const foundParticipantList = await client.chatRoomParticipant.findMany({
      where: { userId },
      include: { chatRoom: true }
    });

    return foundParticipantList.map(participant => {
      return {
        id: participant.chatRoom.id,
        participantNicknameList: participant.chatRoom.userNicknameList,
      }
    })
  }

  public connectChatRoom = async (roomId: string) => {
    this.logger.debug(`ChatService > connectChatRoom, roomId: ${roomId}`);
    await this.socketServer.connectRoom(roomId);
  }

  public getChatHistoryOnRoom = async (roomId: string) => {
    this.logger.debug(`ChatService > getChatHistoryOnRoom, roomId: ${roomId}`);
    const client = this.mongoClient.getClient();

    return await client.chatRoomChat.findMany({ where: { chatRoomId: roomId }, include: { sender: true } });
  }

  public disconnectChatRoom = async (roomId: string) => {
    this.logger.debug(`ChatService > disconnectChatRoom, roomId: ${roomId}`);
    await this.socketServer.disconnectRoom(roomId);
  }

  public sendMessageToRoom = async (roomId: string, senderId: string, content: string) => {
    const client = this.mongoClient.getClient();
    const sender = await client.user.findFirst({ where: { id: senderId } });

    const newChat = await client.chatRoomChat.create({
      data: {
        chatRoomId: roomId,
        senderNickname: sender.nickname,
        senderId,
        content,
        createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000),
      }
    })
    await this.socketServer.sendMessageToRoom(roomId, newChat, sender);

    return { ...newChat, sender };
  };

  public getRoomUser = async (roomId: string) => {
    const client = this.mongoClient.getClient();
    return await client.chatRoomParticipant.findMany({
      where: {
        chatRoomId: roomId
      },
      include: { user: true }
    })
  }
}