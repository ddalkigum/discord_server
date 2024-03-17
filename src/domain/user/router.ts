import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';
import { IUserService } from './interface';
import { IMiddleware } from '../../inrfastructure/middleware/middleware';

@injectable()
export default class UserRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.Middleware) private middleware: IMiddleware;
  @inject(TYPES.UserService) private userService: IUserService;

  private router = Router();

  public init = () => {
    // Get user information
    this.router.get('/', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { userId } = request.body;
        return await this.userService.getUser(userId);
      })
    })

    this.router.get('/search', this.middleware.authorization, async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const keyword = request.query;
        return await this.userService.findUser(keyword.q as string);
      })
    })

    // Delete user
    this.router.delete('/:userId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const userId = request.params.userId as string;
        console.log(`userId: ${userId}`);
        return await this.userService.deleteUser(userId);
      })
    })
  }

  public getRouter = () => {
    return this.router;
  }
}