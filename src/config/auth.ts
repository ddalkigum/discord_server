const DEFAULT_JWT_SIGN_KEY = 'discord';
const DEFAULT_ISSUER = 'http://localhost:3001';

const authConfig = {
  jwtSignKey: process.env.JWT_SIGN_KEY || DEFAULT_JWT_SIGN_KEY,
  issuer: process.env.ISSUER || DEFAULT_ISSUER,
  maxAge: {
    accessToken: 1000 * 60 * 60,
    refreshToken: 1000 * 60 * 60 * 24 * 30,
  }
}

export default authConfig;