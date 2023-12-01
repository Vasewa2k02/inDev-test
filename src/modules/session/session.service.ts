import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExceptionMessage } from 'src/common/enums/exception-message.enum';

import { Session } from './entities/session.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private userService: UserService,
  ) {}

  async createOrUpdateSessionByUserId(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { user: { id: userId } },
    });

    if (session) {
      session.refreshToken = refreshToken;
      await this.sessionRepository.save(session);
    } else {
      const user = await this.userService.getUserById(userId);
      await this.sessionRepository.save(new Session({ user, refreshToken }));
    }
  }

  async getRefreshToken(userId: number): Promise<string> {
    const session = await this.sessionRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!session) {
      throw new ForbiddenException(ExceptionMessage.sessionNotFound);
    }

    return session.refreshToken;
  }
}
