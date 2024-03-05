import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';
import { IServerService } from './interface';

@injectable()
export default class ServerRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.ServerService) private serverService: IServerService;

  private router = Router();

  public init = () => {
    // Get participate server
    this.router.get('/:userId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const userId = request.query.userId as string;
        return await this.serverService.getParticipateServer(userId);
      })
    })

    // Create Server
    this.router.post('/:userId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const userId = request.query.userId as string;
        const { serverName, serverType } = request.body;
        return await this.serverService.createServer(userId, serverName, serverType);
      })
    })
  }

  public getRouter = () => {
    return this.router;
  }
}