import express from 'express';
import socketIO from 'socket.io';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { inject, injectable } from 'inversify';
import { IServer } from './interface';
import helmet from 'helmet';
import { TYPES } from '../../type';

@injectable()
export default class ExpressServer implements IServer {
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

    this.app.post('/send/chat/:serverName/:room', (request, response, next) => {
      const { serverName, room } = request.params;
      response.json({ Success: true });
    })


  }

  public start = (port: string) => {
    this.server.listen(port);
    console.log(`Server on ${port}`);
  }

  public exit = () => {
    try {
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  }
}