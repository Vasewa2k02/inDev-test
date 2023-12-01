import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WinstonLoggerService } from 'modules/winston-logger/winston-logger.service';
import { APP_ENVIRONMENT } from '../constants/env-variables';
import { AppEnvironment } from '../enums/app-environment.enum';

export interface Response<T> {
  data: T;
}

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private loggerService: WinstonLoggerService,
    private configService: ConfigService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      tap((data) => {
        if (this.configService.get(APP_ENVIRONMENT) !== AppEnvironment.prod) {
          this.loggerService.log(`[RESPONSE] ${JSON.stringify(data)}`);
        }
      }),
    );
  }
}
