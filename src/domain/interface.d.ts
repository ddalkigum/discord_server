import { Router } from 'express';

export interface IHttpRouter {
  init: () => void;
  getRouter: () => Router;
}