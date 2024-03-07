import { Channel } from '@prisma/client';
import { ObjectId } from 'typeorm';

export interface IChannelService {
  getAllChannel: (serverId: string) => Promise<Channel[]>;
  createChannel: (serverId: string, userId: string, type: string, channelName: string) => Promise<void>;
  updateChannel: (serverId: string, userId: string, channelId: ObjectId) => Promise<Exclude<Channel | Chat[]>>;
  deleteChannel: (serverId: string, userId: string, chnnelId: ObjectId) => Promise<void>;
}
