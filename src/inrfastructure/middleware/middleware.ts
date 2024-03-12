import { inject, injectable } from 'inversify';
import { TYPES } from '../../type';
import { IMongoClient } from '../database/mongo/interface';
import { NextFunction, Request, Response } from 'express';
import ErrorGenerator from '../../domain/common/error';
import { generateAccessToken, verifyToken } from '../../lib/jwt';
import * as config from '../../config';
import { setCookie, unsetCookie } from '../../lib/cookie';

export interface IMiddleware {
  authorization: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}

@injectable()
export default class Middleware implements IMiddleware {
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;

  public authorization = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = request.cookies;
      if (accessToken) {
        const { userId, isExpired } = verifyToken(accessToken);
        if (!isExpired) {
          request.body.userId = userId;
          return next();
        }
      }

      if (!refreshToken) {
        const error = ErrorGenerator.unAuthorized('TokenRequired');
        throw error;
      }

      const { userId } = verifyToken(refreshToken);
      const newAccessToken = generateAccessToken({ userId }, config.Auth.issuer);

      const client = this.mongoClient.getClient();
      await client.auth.update({ where: { userId }, data: { accessToken: newAccessToken } });

      request.body.userId = userId;
      setCookie(response, newAccessToken, refreshToken);
      return next();
    } catch (error) {
      unsetCookie(response);
      next(error);
    }
  }
}