import jwt from 'jsonwebtoken';
import * as config from '../config';

type AccessTokenPayload = {
  userId: string
}

type RefreshTokenPayload = {
  userId: string,
  tokenId: string,
}

const generateAccessToken = (payload: AccessTokenPayload, issuer: string) => {
  return jwt.sign(
    payload,
    config.Auth.jwtSignKey,
    {
      expiresIn: '1h',
      issuer,
      subject: 'access_token'
    }
  )
}

const generateRefreshToken = (payload: RefreshTokenPayload, issuer: string) => {
  return jwt.sign(
    payload,
    config.Auth.jwtSignKey,
    {
      expiresIn: '30d',
      issuer,
      subject: 'refresh_token'
    }
  )
}

const verifyToken = (token: string) => {
  let isExpired = false;
  try {
    const { issuer } = config.Auth;
    const verifiedToken: any = jwt.verify(token, config.Auth.jwtSignKey, { issuer });
    return { ...verifiedToken, isExpired };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return { isExpired: true };
    throw error;
  }
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
}