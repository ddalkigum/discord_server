import { Chat, ChatRoom, ChatRoomChat, ChatRoomParticipant, User } from '@prisma/client';

type IGetChatRoomList = {
  id: string,
  participantNicknameList: String[]
}

export default interface IChatService {
  sendChat: (serverId: string, channelId: string, senderId: string, content: string) => Promise<void>;
  getChatHistory: (serverId: string, channelId: string) => Promise<Chat[]>;
  createChatRoom: (userId: string, participateId: string) => Promise<any>;
  getChatRoomList: (userId: string) => Promise<IGetChatRoomList[]>;
  connectChatRoom: (roomId: string) => Promise<void>;
  getChatHistoryOnRoom: (roomId: string) => Promise<ChatRoomChat[]>;
  disconnectChatRoom: (roomId: string) => Promise<void>;
  sendMessageToRoom: (roomId: string, senderId: string, content: string) => Promise<ChatRoomChat>;
  getRoomUser: (roomId: string) => Promise<ChatRoomParticipant[]>;
}
