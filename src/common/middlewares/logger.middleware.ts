import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';

import { RequestWithUser } from 'src/modules/auth/types/request-with-user.interface';
import { WinstonLoggerService } from 'modules/winston-logger/winston-logger.service';

import { getRequestInformation } from '../constants/logger-info';
import { APP_ENVIRONMENT } from '../constants/env-variables';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private loggerService: WinstonLoggerService,
    private configService: ConfigService,
  ) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    this.loggerService.log(
      getRequestInformation(
        String(this.configService.get(APP_ENVIRONMENT)),
        req,
      ),
    );

    next();
  }
}
