import express from 'express';
import socketIO from 'socket.io';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { inject, injectable } from 'inversify';
import { IExpressServer } from './interface';
import helmet from 'helmet';
import { TYPES } from '../../type';
import { IWinstonLogger } from '../logger/interface';
import { IHttpRouter } from '../../domain/interface';
import socketIo from 'socket.io';
import { ISocketServer } from './socket';
import { checkPassword, encrypt } from '../../lib/hash';
import { IApiResponse } from '../../domain/common/interface';

@injectable()
export default class ExpressServer implements IExpressServer {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.ServerRouter) private serverRouter: IHttpRouter;
  @inject(TYPES.UserRouter) private userRouter: IHttpRouter;
  @inject(TYPES.ChatRouter) private chatRouter: IHttpRouter;
  @inject(TYPES.ChannelRouter) private channelRouter: IHttpRouter;
  @inject(TYPES.AuthRouter) private authRouter: IHttpRouter;

  private app: express.Application;
  private server: http.Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  public getApp = () => {
    return this.app;
  }

  public getServer = () => {
    return this.server;
  }

  public setServer = () => {
    this.app.use(helmet());
    this.app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.get('/health', (request, response, next) => {
      this.logger.http('Health check')
      response.send('Success');
    })

    this.serverRouter.init();
    this.userRouter.init();
    this.channelRouter.init();
    this.chatRouter.init();
    this.authRouter.init();

    this.app.use('/auth', this.authRouter.getRouter());
    this.app.use('/server', this.serverRouter.getRouter());
    this.app.use('/user', this.userRouter.getRouter());
    this.app.use('/channel', this.channelRouter.getRouter());
    this.app.use('/chat', this.chatRouter.getRouter());

    this.app.use(this.apiResponse.generateNotFound);
    this.app.use(this.apiResponse.errorResponse);
  }

  public start = (port: string) => {
    this.server.listen(port);
    this.logger.info(`Server on ${port}`);
  }

  public exit = () => {
    try {
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  }
}