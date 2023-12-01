import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionService } from './session.service';
import { Session } from './entities/session.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), UserModule],
  exports: [SessionService],
  controllers: [],
  providers: [SessionService],
})
export class SessionModule {}
