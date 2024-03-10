import { Response } from 'express';
import * as config from '../config';

export const setCookie = (response: Response, accessToken: string, refreshToken?: string) => {
  response.cookie('accessToken', accessToken, {
    domain: config.Server.baseUrl,
    httpOnly: true,
    maxAge: config.Auth.maxAge.accessToken
  })

  if (refreshToken) {
    response.cookie('refreshToken', refreshToken, {
      domain: config.Server.baseUrl,
      httpOnly: true,
      maxAge: config.Auth.maxAge.refreshToken
    })
  }
}

export const unsetCookie = (response: Response) => {
  response.cookie('accessToken', '', {
    domain: config.Server.baseUrl,
    maxAge: 0
  })

  response.cookie('refreshToken', '', {
    domain: config.Server.baseUrl,
    maxAge: 0,
  })
}