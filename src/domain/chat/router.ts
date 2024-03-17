import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';
import { IChatService } from './interface';
import { validateContext } from '../../lib/validate';
import Joi from 'joi';
import { IMiddleware } from '../../inrfastructure/middleware/middleware';

@injectable()
export default class ChatRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.Middleware) private middleware: IMiddleware;
  @inject(TYPES.ChatService) private chatService: IChatService;

  private router = Router();

  public init = () => {
    /**
     * Channel 채팅
     */
    this.router.post('/send/:serverId/:channelId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { serverId, channelId } = request.params;
        const { senderId, content } = request.body;
        const schema = Joi.object({
          serverId: Joi.string().required(),
          channelId: Joi.string().required(),
          senderId: Joi.string().required(),
          content: Joi.string().required(),
        })

        validateContext({ serverId, channelId, senderId, content }, schema);
        return await this.chatService.sendChat(serverId, channelId, senderId, content);
      })
    })

    // GET channel chat history
    this.router.get('/history/:serverId/:channelId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { serverId, channelId } = request.params;
        const schema = Joi.object({
          serverId: Joi.string().required(),
          channelId: Joi.string().required(),
        })

        validateContext({ serverId, channelId }, schema);
        return await this.chatService.getChatHistory(serverId, channelId);
      })
    })

    /**
     * DM, Room 관련
     */
    this.router.post('/room', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { userId, participantId } = request.body;
        const schema = Joi.object({
          userId: Joi.string().required(),
          participantId: Joi.string().required(),
        })

        validateContext({ userId, participantId }, schema);
        return await this.chatService.createChatRoom(userId, participantId);
      })
    })

    this.router.get('/room', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { userId } = request.body;
        const schema = Joi.object({
          userId: Joi.string().required(),
        })

        validateContext({ userId }, schema);
        return await this.chatService.getChatRoomList(userId);
      })
    })

    this.router.get('/connect/:roomId', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { roomId } = request.params;
        const { userId } = request.body;
        const schema = Joi.object({
          roomId: Joi.string().required(),
          userId: Joi.string().required(),
        })

        validateContext({ roomId, userId }, schema);
        await this.chatService.connectChatRoom(roomId);
        return await this.chatService.getChatHistoryOnRoom(roomId);
      })
    })

    this.router.get('/disconnect/:roomId', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { roomId } = request.params;
        const schema = Joi.object({
          roomId: Joi.string().required(),
        })

        validateContext({ roomId }, schema);
        await this.chatService.disconnectChatRoom(roomId);
        return 'Success'
      })
    })

    this.router.post('/room/send/:roomId', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { roomId } = request.params;
        const { userId, content } = request.body;
        const schema = Joi.object({
          roomId: Joi.string().required(),
          content: Joi.string().required(),
        })

        validateContext({ roomId, content }, schema);
        return await this.chatService.sendMessageToRoom(roomId, userId, content);
      })
    })

    this.router.get('/room/user/:roomId', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { roomId } = request.params;
        const schema = Joi.object({
          roomId: Joi.string().required(),
        })

        validateContext({ roomId }, schema);
        return await this.chatService.getRoomUser(roomId);
      })
    })
  }

  public getRouter = () => {
    return this.router;
  }
}