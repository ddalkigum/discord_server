import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { IAuthService } from './interface';
import { TYPES } from '../../type';
import { IWinstonLogger } from '../../inrfastructure/logger/interface';
import { IMongoClient } from '../../inrfastructure/database/mongo/interface';
import { checkPassword, encrypt } from '../../lib/hash';
import ErrorGenerator from '../common/error';
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt';
import * as config from '../../config';

@injectable()
export default class AuthService implements IAuthService {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;
  @inject(TYPES.MongoClient) private mongoClient: IMongoClient;

  public login = async (email: string, password: string) => {
    this.logger.debug(`AuthService > login, email: ${email}, password: ${password}`);
    const client = this.mongoClient.getClient();
    const user = await client.user.findFirst({ where: { email } });

    if (!user) throw ErrorGenerator.unAuthorized('Does not exist user');

    const isCorrectPassword = await checkPassword(password, user.password);
    if (!isCorrectPassword) throw ErrorGenerator.unAuthorized('Incorrect password');

    const tokenId = uuidv4();

    const accessToken = generateAccessToken({ userId: user.id }, config.Auth.issuer);
    const refreshToken = generateRefreshToken({ userId: user.id, tokenId }, config.Auth.issuer);

    await client.auth.update({ where: { userId: user.id }, data: { accessToken, refreshToken } });

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt
      },
      tokenSet: { accessToken, refreshToken }
    }
  }

  public signup = async (email: string, password: string, nickname: string) => {
    this.logger.debug(`AuthService > signup, email: ${email}, password: ${password}, nickname: ${nickname}`);
    const client = this.mongoClient.getClient();
    const foundUser = await client.user.findFirst({ where: { email } });

    if (foundUser) throw ErrorGenerator.badRequest('Already exist user');

    const hashedPassword = await encrypt(password);
    const user = await client.user.create({ data: { email, password: hashedPassword, nickname, createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000) } });

    const tokenId = uuidv4();

    const accessToken = generateAccessToken({ userId: user.id }, config.Auth.issuer);
    const refreshToken = generateRefreshToken({ userId: user.id, tokenId }, config.Auth.issuer);

    await client.auth.create({
      data: {
        id: tokenId,
        userId: user.id,
        accessToken,
        refreshToken
      }
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      tokenSet: { accessToken, refreshToken }
    }
  }
}