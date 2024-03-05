import { User } from '@prisma/client';

export interface IUserService {
  getUser: (userId: string) => Promise<User>;
  createUser: (email: string, password: string, nickname: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}