import { injectable } from 'inversify';
import { IApiResponse } from './interface';
import { Request, Response, NextFunction } from 'express';
import ErrorGenerator, { BaseError } from './error';

@injectable()
export default class ApiResponse implements IApiResponse {
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
      // TODO: Winston warn logget
    } else {
      error['statusCode'] = 500;
    }

    console.log(error)

    response.status(error['statusCode']).json({
      success: false,
      result: {
        name: error.name,
        message: error.message,
      }
    })
  }
}