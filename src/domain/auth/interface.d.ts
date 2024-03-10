import { User } from '@prisma/client';

interface UserLoginResult {
  user: Pick<User, 'id' | 'email' | 'nickname' | 'createdAt'>,
  tokenSet: {
    accessToken: string,
    refreshToken: string
  }
}

export interface IAuthService {
  login: (id: string, password: string) => Promise<UserLoginResult>;
  signup: (id: string, password: string, nickname: string) => Promise<UserLoginResult>;
}