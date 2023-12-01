import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';

import { WinstonLoggerService } from 'modules/winston-logger/winston-logger.service';
import { ExceptionMessage } from '../enums/exception-message.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private loggerService: WinstonLoggerService) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const responce = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      this.loggerService.error(
        `${request.method} ${request.url} QUERY ${JSON.stringify(
          request.query,
        )} BODY ${JSON.stringify(request.body)} ${JSON.stringify(
          responce.errorBody,
        )} ${exception}`,
      );

      responce.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    } else {
      this.loggerService.error(`${exception}`);

      responce.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ExceptionMessage.internalServerError,
      });
    }
  }
}
