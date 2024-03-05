import { injectable } from 'inversify';
import { IWinstonLogger } from './interface';
import WinstonDaily from 'winston-daily-rotate-file';
import Winston from 'winston';

@injectable()
export default class WinstonLogger implements IWinstonLogger {
  private logger: Winston.Logger;

  constructor() {
    this.init();
  }

  public init = (): boolean => {
    const { combine, timestamp, printf } = Winston.format;
    const logDir = 'logs';

    const logFormat = printf(({ level, timestamp, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })

    const debugFormat = printf(({ level, message }) => {
      return `${level}: ${message}`;
    });

    this.logger = Winston.createLogger({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
      ),
      transports: [
        // http, warn, error level log
        new WinstonDaily({
          level: 'http',
          datePattern: 'YYYY-MM-DD',
          dirname: logDir + '/http', // log 파일은 /logs/http 하위에 저장
          filename: '%DATE%.log',
          maxFiles: 30, // 30-day logs
          zippedArchive: true,
        }),

        // error level log
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
          filename: '%DATE%.error.log',
          maxFiles: 30, // 30-day logs
          zippedArchive: true,
        }),

        new WinstonDaily({
          level: 'warn',
          datePattern: 'YYYY-MM-DD',
          dirname: logDir + '/warn', // error.log 파일은 /logs/warn 하위에 저장
          filename: '%DATE%.warn.log',
          maxFiles: 30, // 30-day logs
          zippedArchive: true,
        }),
      ],
    });

    // 개발환경 debug 로그
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new Winston.transports.Console({
          level: 'debug',
          format: Winston.format.combine(
            Winston.format.colorize(), // 색깔 넣어서 출력
            debugFormat
          ),
        })
      );
    }

    return true;
  }

  public debug = (message: any): void => {
    this.logger.debug(message);
  };

  public http = (message: any): void => {
    this.logger.http(message);
  };

  public info = (message: any): void => {
    this.logger.info(message);
  };

  public warn = (message: any): void => {
    this.logger.warn(message);
  };

  public error = (message: any): void => {
    this.logger.error(message);
  };
}