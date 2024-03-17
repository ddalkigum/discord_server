import { Channel } from '@prisma/client';

export type ServerType = 'community' | 'friendship';

export default interface IServerService {
  getParticipateServer: (userId: string) => Promise<any>;
  participateServer: (userId: string, serverId: string) => Promise<void>;
  createServer: (userId: string, name: string, type: ServerType) => Promise<void>;
  deleteServer: (userId: string, serverId: string) => Promise<void>;
  getChannelListOnServer: (serverId: string) => Promise<Channel[]>;
}