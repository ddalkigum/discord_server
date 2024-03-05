import { inject, injectable } from 'inversify';
import { IApiResponse } from './interface';
import { Request, Response, NextFunction } from 'express';
import ErrorGenerator, { BaseError } from './error';
import { TYPES } from '../../type';
import { IWinstonLogger } from '../../inrfastructure/logger/interface';

@injectable()
export default class ApiResponse implements IApiResponse {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;

  public generateResponse = async (request: Request, response: Response, next: NextFunction, func: any) => {
    try {
      const result = await func();
      response.status(200).json({
        success: true,
        result
      })
    } catch (error) {
      next(error);
    }
  }

  public generateNotFound = async (request: Request, response: Response, next: NextFunction) => {
    const error = ErrorGenerator.notFound();
    next(error);
  }

  public errorResponse = async (error: BaseError | Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof BaseError) {
      this.logger.warn(error);
    } else {
      error['statusCode'] = 500;
    }

    response.status(error['statusCode']).json({
      success: false,
      result: {
        name: error.name,
        message: error.message,
      }
    })
  }
}