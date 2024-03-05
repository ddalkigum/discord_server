import { injectable } from 'inversify';
import { IChannelService } from './interface';

@injectable()
export default class ChannelService implements IChannelService {
  createChannel: (user: any, channelName: string) => Promise<void>;
  updateChannel: (user: any, channelId: string) => Promise<any>;
  deleteChannel: (user: any, chnnelId: string) => Promise<void>;

}