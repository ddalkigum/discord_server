import { inject, injectable } from 'inversify';
import { TYPES } from '../../type';
import { Server } from 'socket.io';
import { IWinstonLogger } from '../logger/interface';
import { Server as httpServer } from 'http';
import { IMongoClient } from '../database/mongo/interface';

export interface ISocketServer {
  init: (server: httpServer) => void;
  getIo: () => Server;
  connectChannel: (serverId: string, channelId: string) => void;
  disconnectChannel: (serverId: string, channelId: string) => void;
  sendMessage: (serverId: string, channelId: string, content: string) => void;
  connectRoom: (roomId: string, userId: string) => void;
  disconnectRoom: (roomId: string) => void;
}

@injectable()
export default class SocketServer implements ISocketServer {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;

  private io: Server;

  public init = (server: httpServer) => {
    this.io = new Server(server, {
      connectTimeout: 3000,
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      }
    });
    this.logger.info(`Socket server on`);
  }

  public getIo = () => {
    return this.io;
  }

  public connectChannel = (serverId: string, channelId: string) => {
    this.logger.debug(`Connect channel, serverId: ${serverId}, channelId: ${channelId}`)
    this.io.on('connection', () => console.log("servser connection on"))
    const channel = this.io.of(`/${serverId}/${channelId}`)

    channel.on('connection', () => console.log('connect'))
    channel.on('disconnect', () => {
      console.log('disconnect')
    })
  }

  public disconnectChannel = (serverId: string, channelId: string) => {
  }

  public sendMessage = (serverId: string, channelId: string, content: string) => {
    this.logger.debug(`SocketServer > sendMessage, serverId: ${serverId}, channelId: ${channelId}`);
    const channel = this.io.of(`/${serverId}/${channelId}`);
    channel.emit('chatMessage', content);
  }

  public connectRoom = (roomId: string, userId: string) => {
    this.logger.debug(`SocketService > connectRoom, roomId: ${roomId}`);

    const room = this.io.of(`/${roomId}`);
    let socketId;

    room.on('connection', (socket) => {
      this.logger.debug('===== connection =====')
      socket.on('connectData', (data) => {
        socketId = data;
      })

      socket.on(`/${roomId}-message`, async (message) => {
        this.logger.debug(`message: ${message}`);
        // const client = this.mongoClient.getClient();
        // await client.chatRoomChat.create({ data: { senderId: userId, chatRoomId: roomId, createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000) } })
        socket.emit(`/${roomId}-message`, message)
      })

      socket.on('disconnect', () => {
        this.logger.debug('===== User disconnect =====')
        socket.disconnect(true);
      })
    })
  }

  public disconnectRoom = (roomId: string) => {
    const room = this.io.of(`/${roomId}`);
    room.disconnectSockets(true);
  };
}