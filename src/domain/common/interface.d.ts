import { NextFunction, Request, Response } from 'express';
import { BaseError } from './error';

export interface IApiResponse {
  generateResponse: (request: Request, response: Response, next: NextFunction, func: any) => Promise<void>;
  generateNotFound: (request: Request, response: Response, next: NextFunction) => void;
  errorResponse: (error: BaseError, request: Request, response: Response, next: NextFunction) => void;
}