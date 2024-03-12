import { User } from '@prisma/client';

export interface IUserService {
  getUser: (userId: string) => Promise<Partial<User>>;
  createUser: (email: string, password: string, nickname: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
}