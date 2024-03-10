import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';
import Joi from 'joi';
import { validateContext } from '../../lib/validate';
import { IAuthService } from './interface';
import { setCookie } from '../../lib/cookie';

@injectable()
export default class AuthRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;
  @inject(TYPES.AuthService) private authService: IAuthService;

  private router = Router();

  public init = () => {
    this.router.post('/login', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { email, password } = request.body;
        const schema = Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
        })

        validateContext({ email, password }, schema);
        const result = await this.authService.login(email, password);
        setCookie(response, result.tokenSet.accessToken, result.tokenSet.refreshToken);
        return result.user;
      })
    })

    this.router.post('/signup', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {
        const { email, password, nickname } = request.body;
        const schema = Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
          nickname: Joi.string().required(),
        })

        validateContext({ email, password, nickname }, schema);
        const result = await this.authService.signup(email, password, nickname);
        setCookie(response, result.tokenSet.accessToken, result.tokenSet.refreshToken);
        return result.user;
      })
    })
  }

  public getRouter = () => {
    return this.router;
  }
}