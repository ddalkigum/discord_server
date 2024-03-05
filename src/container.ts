import 'reflect-metadata';
import { Container } from 'inversify';
import { IServer } from './inrfastructure/server/interface';
import { TYPES } from './type';
import ExpressServer from './inrfastructure/server/express';
import { IApiResponse } from './domain/common/interface';
import { ApiResponse } from './domain/common';
import { IHttpRouter } from './domain/interface';
import * as Channel from './domain/channel';
import { IChannelService } from './domain/channel/interface';
import { IWinstonLogger } from './inrfastructure/logger/interface';
import WinstonLogger from './inrfastructure/logger/winston';

export const container = new Container();

// Infrastructure
container.bind<IServer>(TYPES.Server).to(ExpressServer);
container.bind<IWinstonLogger>(TYPES.WinstonLogger).to(WinstonLogger);

// Common
container.bind<IApiResponse>(TYPES.ApiResponse).to(ApiResponse);

// Domain
container.bind<IHttpRouter>(TYPES.ChannelRouter).to(Channel.Router);
container.bind<IChannelService>(TYPES.ChannelService).to(Channel.Service);
