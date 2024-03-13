import { inject, injectable } from 'inversify';
import redis, { Redis } from 'ioredis';
import { TYPES } from '../../../type';
import { IWinstonLogger } from '../../logger/interface';

export interface IRedisClient {
  init: () => void;
  getSubscriber: () => redis;
  getClient: () => redis;
}

@injectable()
export default class RedisClient implements IRedisClient {
  @inject(TYPES.WinstonLogger) private logger: IWinstonLogger;

  private client: Redis;
  private subscriber: redis;

  public init = () => {
    this.client = new Redis({
      host: '127.0.0.1',
      port: 6379,
    })

    this.client.ping().then(() => {
      this.logger.info(`Redis connected!`);
    })

    this.subscriber = redis.createClient();
  }

  public getSubscriber = () => {
    return this.subscriber;
  }

  public getClient = () => {
    return this.client;
  }
}