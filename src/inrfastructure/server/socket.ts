import { inject, injectable } from 'inversify';
import { TYPES } from '../../type';
import { Server } from 'socket.io';
import { IWinstonLogger } from '../logger/interface';
import { Server as httpServer } from 'http';
import { IMongoClient } from '../database/mongo/interface';
import { IRedisClient } from '../database/redis/client';

export interface ISocketServer {
  init: (server: httpServer) => void;
  getIo: () => Server;
  connectChannel: (serverId: string, channelId: string) => void;
  disconnectChannel: (serverId: string, channelId: string) => void;
  sendMessage: (serverId: string, channelId: string, content: string) => void;
  connectRoom: (roomId: string) => Promise<void>;
  disconnectRoom: (roomId: string) => Promise<void>;
  sendMessageToRoom: (roomId: string, senderId: string, content: string) => Promise<void>;
}

@injectable()
export default class SocketServer implements ISocketServer {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;
  @inject(TYPES.RedisClient) private redisClient: IRedisClient;
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
    const client = this.redisClient.getClient();
  }

  public connectRoom = async (roomId: string) => {
    this.logger.debug(`SocketService > connectRoom, roomId: ${roomId}`);

    const client = this.redisClient.getSubscriber();
    await client.subscribe(roomId, (error, count) => {
      this.logger.debug(`Total subscriber: ${count}`);
    });

    client.on('connect', () => {
      this.logger.debug(`Subscribe complete!`)
    })

    client.on(roomId, (channel, message) => {
      this.logger.debug(`On message, channel: ${channel}, message: ${message}`);
    })
  }

  public disconnectRoom = async (roomId: string) => {
    await this.redisClient.getSubscriber().unsubscribe(roomId);
  };

  public sendMessageToRoom = async (roomId: string, senderId: string, content: string) => {
    this.logger.debug(`SocketService > sendMessageToRoom, roomId: ${roomId}, senderId: ${senderId}, content: ${content}`)
    const message = { senderId, content };
    this.io.emit(roomId, message)
    await this.redisClient.getClient().publish(roomId, JSON.stringify(message));
  }
}