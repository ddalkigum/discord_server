import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';
import { IMiddleware } from '../../inrfastructure/middleware/middleware';
import Joi from 'joi';
import { validateContext } from '../../lib/validate';
import IServerService from './interface';

@injectable()
export default class ServerRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.Middleware) private middleware: IMiddleware;
  @inject(TYPES.ServerService) private serverService: IServerService;

  private router = Router();

  public init = () => {
    // Get participate server
    this.router.get('/', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { userId } = request.body
        return await this.serverService.getParticipateServer(userId);
      })
    })

    // Create Server
    this.router.post('/', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { serverName, serverType, userId } = request.body;

        const schema = Joi.object({
          serverName: Joi.string().required(),
          serverType: Joi.string().required()
        })

        validateContext({ serverName, serverType }, schema);
        return await this.serverService.createServer(userId, serverName, serverType);
      })
    })

    this.router.get('/channel/:serverId', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { serverId } = request.params;

        const schema = Joi.object({
          serverId: Joi.string().required(),
        })

        validateContext({ serverId }, schema);
        return await this.serverService.getChannelListOnServer(serverId);
      })
    })
  }

  public getRouter = () => {
    return this.router;
  }
}