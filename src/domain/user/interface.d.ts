import { User } from '@prisma/client';

export default interface IUserService {
  getUser: (userId: string) => Promise<Partial<User>>;
  findUser: (nickname: string) => Promise<Partial<User>[]>;
  deleteUser: (userId: string) => Promise<void>;
}