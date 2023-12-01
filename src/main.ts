import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ValidationError } from 'class-validator';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/middlewares/exeption-handler.middleware';
import { APP_HOST, APP_PORT } from './common/constants/env-variables';
import { WinstonLoggerService } from './modules/winston-logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const loggerService: WinstonLoggerService = app.get(WinstonLoggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException(
          errors.reduce(
            (message, currentError) =>
              message + Object.values(currentError.constraints) + '. ',
            '',
          ),
        ),
    }),
  );
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter(loggerService));

  const configService: ConfigService = app.get(ConfigService);
  const PORT = configService.get(APP_PORT);
  const HOST = configService.get(APP_HOST);
  const config = new DocumentBuilder()
    .setTitle('inDev')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(PORT, () => {
    console.log(`Server launched on host: ${HOST}:${PORT}`);
  });
}

bootstrap();
