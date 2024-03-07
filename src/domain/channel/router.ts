import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';
import Joi from 'joi';
import { validateContext } from '../../lib/validate';
import { IChannelService } from './interface';

@injectable()
export default class ChannelRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.ChannelService) private channelService: IChannelService;

  private router = Router();

  public init = () => {
    // GET all channel
    this.router.get('/:serverId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { serverId } = request.params;
        const schema = Joi.object({
          serverId: Joi.string().required()
        });

        validateContext({ serverId }, schema);
        return await this.channelService.getAllChannel(serverId);
      })
    })

    // Create channel
    this.router.post('/', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { serverId, userId, type, channelName } = request.body;
        const schema = Joi.object({
          serverId: Joi.string().required(),
          userId: Joi.string().required(),
          type: Joi.string().optional(),
          channelName: Joi.string().optional(),
        })

        validateContext({ serverId, userId, type, channelName }, schema);
        return await this.channelService.createChannel(serverId, userId, type, channelName);
      })
    })
  }

  public getRouter = () => {
    return this.router;
  }
}