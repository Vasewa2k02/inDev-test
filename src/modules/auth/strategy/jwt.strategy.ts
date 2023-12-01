import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

import { UserResponse } from 'modules/user/response/user.response';
import { UserService } from 'modules/user/user.service';

import { JWT_ACCESS_TOKEN_SECRET } from '../constants/env-variables';
import { TokenPayload } from '../types/token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      secretOrKey: configService.get(JWT_ACCESS_TOKEN_SECRET),
    });
  }

  async validate(payload: TokenPayload): Promise<UserResponse> {
    return await this.userService.getUserById(payload.userId);
  }
}
