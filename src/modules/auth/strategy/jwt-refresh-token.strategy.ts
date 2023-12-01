import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserResponse } from 'modules/user/response/user.response';

import { AuthService } from '../auth.service';
import { JWT_REFRESH_TOKEN } from '../constants/guard';
import { JWT_REFRESH_TOKEN_SECRET } from '../constants/env-variables';
import { TokenPayload } from '../types/token-payload.type';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_TOKEN,
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.get(JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: TokenPayload,
  ): Promise<UserResponse> {
    return this.authService.getUserIfRefreshTokenMatches(
      request?.cookies?.refreshToken,
      payload.userId,
    );
  }
}
