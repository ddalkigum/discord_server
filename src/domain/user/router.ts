import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';
import { IUserService } from './interface';

@injectable()
export default class UserRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.UserService) private userService: IUserService;

  private router = Router();

  public init = () => {
    // Get user information
    this.router.get('/:userId', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const userId = request.params.userId as string;
        return await this.userService.getUser(userId);
      })
    })

    // Create user
    this.router.post('/', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { email, password, nickname } = request.body;
        return await this.userService.createUser(email, password, nickname);
      })
    })

    // Signin
    this.router.get('/', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { email, password } = request.body;
        return await this.userService.signin(email, password);
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