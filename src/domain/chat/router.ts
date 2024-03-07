import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';
import { IChatService } from './interface';
import { validateContext } from '../../lib/validate';
import Joi from 'joi';

@injectable()
export default class ChatRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.ChatService) private chatService: IChatService;

  private router = Router();

  public init = () => {
    // GET channel chat history
    this.router.get('/:serverId/:channelId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { serverId, channelId } = request.params;
        const schema = Joi.object({
          serverId: Joi.string().required(),
          channelId: Joi.string().required()
        })

        validateContext({ serverId, channelId }, schema);
        return await this.chatService.getChatHistory(serverId, channelId);
      })
    })

    this.router.post('/:serverId/:channelId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { serverId, channelId } = request.params;
        const { content, userId } = request.body;
        const schema = Joi.object({
          serverId: Joi.string().required(),
          channelId: Joi.string().required(),
          content: Joi.string().required(),
          userId: Joi.string().required()
        })

        validateContext({ serverId, channelId, content, userId }, schema);
        return await this.chatService.sendChat(serverId, channelId, userId, content);
      })
    })
  }

  public getRouter = () => {
    return this.router;
  }
}