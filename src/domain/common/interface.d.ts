import { NextFunction, Request, Response } from 'express';

export interface IApiResponse {
  generateResponse: (request: Request, response: Response, next: NextFunction, func: any) => Promise<void>;
  generateNotFound: (request: Request, response: Response, next: NextFunction, func: any) => Promise<void>;
  errorResponse: (error: Error, request: Request, response: Response, next: NextFunction, func: any) => Promise<void>;
}