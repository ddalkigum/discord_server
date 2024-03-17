import 'reflect-metadata';
import { Container } from 'inversify';
import { IExpressServer } from './inrfastructure/server/interface';
import { TYPES } from './type';
import ExpressServer from './inrfastructure/server/express';
import { IApiResponse } from './domain/common/interface';
import { ApiResponse } from './domain/common';
import { IHttpRouter } from './domain/interface';
import * as Auth from './domain/auth';
import * as Channel from './domain/channel';
import * as Chat from './domain/chat';
import * as Server from './domain/server';
import * as User from './domain/user';
import { IChannelService } from './domain/channel/interface';
import { IWinstonLogger } from './inrfastructure/logger/interface';
import WinstonLogger from './inrfastructure/logger/winston';
import { IMongoClient } from './inrfastructure/database/mongo/interface';
import MongoClient from './inrfastructure/database/mongo/client';
import { IServerService } from './domain/server/interface';
import { IUserService } from './domain/user/interface';
import { IChatService } from './domain/chat/interface';
import Middleware, { IMiddleware } from './inrfastructure/middleware/middleware';
import SocketServer, { ISocketServer } from './inrfastructure/server/socket';
import { IAuthService } from './domain/auth/interface';
import RedisClient, { IRedisClient } from './inrfastructure/database/redis/client';

export const container = new Container({ defaultScope: 'Singleton' });

// Infrastructure
container.bind<IExpressServer>(TYPES.ExpressServer).to(ExpressServer);
container.bind<IWinstonLogger>(TYPES.WinstonLogger).to(WinstonLogger);
container.bind<IMongoClient>(TYPES.MongoClient).to(MongoClient);
container.bind<IMiddleware>(TYPES.Middleware).to(Middleware);
container.bind<ISocketServer>(TYPES.SocketServer).to(SocketServer);
container.bind<IRedisClient>(TYPES.RedisClient).to(RedisClient);
// Common
container.bind<IApiResponse>(TYPES.ApiResponse).to(ApiResponse);

// Domain
container.bind<IHttpRouter>(TYPES.AuthRouter).to(Auth.Router);
container.bind<IAuthService>(TYPES.AuthService).to(Auth.Service);

container.bind<IHttpRouter>(TYPES.ChatRouter).to(Chat.Router);
container.bind<IChatService>(TYPES.ChatService).to(Chat.Service);

container.bind<IHttpRouter>(TYPES.ChannelRouter).to(Channel.Router);
container.bind<IChannelService>(TYPES.ChannelService).to(Channel.Service);

container.bind<IHttpRouter>(TYPES.ServerRouter).to(Server.Router);
container.bind<IServerService>(TYPES.ServerService).to(Server.Service);

container.bind<IHttpRouter>(TYPES.UserRouter).to(User.Router);
container.bind<IUserService>(TYPES.UserService).to(User.Service);
