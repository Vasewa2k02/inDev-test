import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_ENVIRONMENT } from 'src/common/constants/env-variables';
import { AppEnvironment } from 'src/common/enums/app-environment.enum';

import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from './constants/env-variables';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow(DB_HOST),
        port: configService.getOrThrow(DB_PORT),
        database: configService.getOrThrow(DB_NAME),
        username: configService.getOrThrow(DB_USERNAME),
        password: configService.getOrThrow(DB_PASSWORD),
        autoLoadEntities: true,
        synchronize:
          configService.getOrThrow(APP_ENVIRONMENT) === AppEnvironment.dev,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
