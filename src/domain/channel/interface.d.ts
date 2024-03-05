import { ObjectId } from 'typeorm';

export interface IChannelService {
  createChannel: (user: any, channelName: string) => Promise<void>;
  updateChannel: (user: any, channelId: ObjectId) => Promise<Exclude<Channel | Chat[]>>;
  deleteChannel: (user: any, chnnelId: ObjectId) => Promise<void>;
}
