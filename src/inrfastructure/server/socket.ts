import { inject, injectable } from 'inversify';
import { TYPES } from '../../type';
import { Server } from 'socket.io';
import { IWinstonLogger } from '../logger/interface';
import { Server as httpServer } from 'http';

export interface ISocketServer {
  init: (server: httpServer) => void;
  getIo: () => Server;
  connectChannel: (serverId: string, channelId: string) => void;
  disconnectChannel: (serverId: string, channelId: string) => void;
  sendMessage: (serverId: string, channelId: string, content: string) => void;
}

@injectable()
export default class SocketServer implements ISocketServer {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;

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
    this.io.on('connection', () => {
      this.logger.debug(`Socket connection detect`)
    })
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
}