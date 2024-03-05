import { inject, injectable } from 'inversify';
import { IHttpRouter } from '../interface';
import { TYPES } from '../../type';
import { IApiResponse } from '../common/interface';
import { Router } from 'express';

@injectable()
export default class ServerRouter implements IHttpRouter {
  @inject(TYPES.ApiResponse) private apiResponse: IApiResponse;

  private router = Router();

  public init = () => {
    // GET /server
    this.router.get('', async (request, response, next) => {
      this.apiResponse.generateResponse(request, response, next, async () => {

      })
    })
  }

  public getRouter = () => {
    return this.router;
  }
}