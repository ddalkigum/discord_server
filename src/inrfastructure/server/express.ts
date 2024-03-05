import express from 'express';
import socketIO from 'socket.io';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { inject, injectable } from 'inversify';
import { IServer } from './interface';
import helmet from 'helmet';
import { TYPES } from '../../type';
import { IWinstonLogger } from '../logger/interface';
import { IHttpRouter } from '../../domain/interface';

@injectable()
export default class ExpressServer implements IServer {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;
  @inject(TYPES.ServerRouter) private serverRouter: IHttpRouter;
  @inject(TYPES.UserRouter) private userRouter: IHttpRouter;

  private app: express.Application;
  private server: http.Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  public getApp = () => {
    return this.app;
  }

  public setServer = () => {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.get('/health', (request, response, next) => {
      response.send('Success');
    })

    this.serverRouter.init();
    this.userRouter.init();

    this.app.use('/server', this.serverRouter.getRouter());
    this.app.use('/user', this.userRouter.getRouter());


    // TODO: NotFound
    // TODO: Error Handler
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