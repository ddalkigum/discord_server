import 'reflect-metadata';
import { Container } from 'inversify';
import { IServer } from './inrfastructure/server/interface';
import { TYPES } from './type';
import ExpressServer from './inrfastructure/server/express';
import { IApiResponse } from './domain/common/interface';
import { ApiResponse } from './domain/common';
import { IHttpRouter } from './domain/interface';
import * as Channel from './domain/channel';
import * as Server from './domain/server';
import * as User from './domain/user';
import { IChannelService } from './domain/channel/interface';
import { IWinstonLogger } from './inrfastructure/logger/interface';
import WinstonLogger from './inrfastructure/logger/winston';
import { IMongoClient } from './inrfastructure/database/mongo/interface';
import MongoClient from './inrfastructure/database/mongo/client';
import { IServerService } from './domain/server/interface';
import { IUserService } from './domain/user/interface';

export const container = new Container();

// Infrastructure
container.bind<IServer>(TYPES.Server).to(ExpressServer);
container.bind<IWinstonLogger>(TYPES.WinstonLogger).to(WinstonLogger);
container.bind<IMongoClient>(TYPES.MongoClient).to(MongoClient);

// Common
container.bind<IApiResponse>(TYPES.ApiResponse).to(ApiResponse);

// Domain
container.bind<IHttpRouter>(TYPES.ChannelRouter).to(Channel.Router);
container.bind<IChannelService>(TYPES.ChannelService).to(Channel.Service);

container.bind<IHttpRouter>(TYPES.ServerRouter).to(Server.Router);
container.bind<IServerService>(TYPES.ServerService).to(Server.Service);

container.bind<IHttpRouter>(TYPES.UserRouter).to(User.Router);
container.bind<IUserService>(TYPES.UserService).to(User.Service);
