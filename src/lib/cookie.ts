import { Response } from 'express';
import * as config from '../config';

export const setCookie = (response: Response, accessToken: string, refreshToken?: string) => {
  response.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: config.Auth.maxAge.accessToken
  })

  if (refreshToken) {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: config.Auth.maxAge.refreshToken
    })
  }
}

export const unsetCookie = (response: Response) => {
  response.cookie('accessToken', '', {
    httpOnly: true,
    maxAge: 0
  })

  response.cookie('refreshToken', '', {
    httpOnly: true,
    maxAge: 0,
  })
}