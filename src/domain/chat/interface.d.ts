import { Chat, User } from '@prisma/client';

export interface IChatService {
  sendChat: (serverId: string, channelId: string, senderId: string, content: string) => Promise<void>;
  getChatHistory: (serverId: string, channelId: string) => Promise<Chat[]>;
}
