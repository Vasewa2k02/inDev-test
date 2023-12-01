import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

import { APP_ENVIRONMENT } from 'src/common/constants/env-variables';
import { AppEnvironment } from 'src/common/enums/app-environment.enum';

import { FILE_TRANSPORT_ENVIRONMENTS, LOG_FILE_NAME } from './constants/common';
import { LOG_LEVEL } from './constants/params';

const { combine, timestamp, printf } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    this.logger = winston.createLogger({
      level: this.configService.get(LOG_LEVEL),
      format: combine(timestamp(), customFormat),
    });

    if (
      FILE_TRANSPORT_ENVIRONMENTS.includes(
        String(this.configService.get(APP_ENVIRONMENT)) as AppEnvironment,
      )
    ) {
      this.logger.add(
        new winston.transports.File({
          level: this.configService.get(LOG_LEVEL),
          filename: this.configService.get(LOG_FILE_NAME),
          format: combine(timestamp(), customFormat),
        }),
      );
    } else {
      this.logger.add(
        new winston.transports.Console({
          level: this.configService.get(LOG_LEVEL),
          format: combine(timestamp(), customFormat),
        }),
      );
    }
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
