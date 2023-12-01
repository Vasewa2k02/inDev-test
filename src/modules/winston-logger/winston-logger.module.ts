import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WinstonLoggerService } from './winston-logger.service';

@Module({
  imports: [ConfigModule],
  exports: [WinstonLoggerService],
  controllers: [],
  providers: [WinstonLoggerService, ConfigModule],
})
export class WinstonLoggerModule {}
