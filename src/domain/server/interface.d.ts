import { Participate } from '@prisma/client';

type ServerType = 'community' | 'friendship';

export interface IServerService {
  getParticipateServer: (userId: string) => Promise<any>;
  participateServer: (userId: string, serverId: string) => Promise<void>;
  createServer: (userId: string, name: string, type: ServerType) => Promise<void>;
  deleteServer: (userId: string, serverId: string) => Promise<void>;
}
