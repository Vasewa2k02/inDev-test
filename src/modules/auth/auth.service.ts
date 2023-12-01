import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as cookie from 'cookie';

import { ExceptionMessage } from 'src/common/enums/exception-message.enum';
import { APP_URL, SALT } from 'src/common/constants/env-variables';

import { UserRegistrationDto } from './dto/user-registration.dto';
import {
  CookieWithAccessToken,
  CookieWithRefreshToken,
} from './types/cookie-token.type';
import { RequestWithUser } from './types/request-with-user.interface';
import { TokenPayload } from './types/token-payload.type';
import { UserLoginResponse } from './response/user-login.reponse';
import { SessionService } from '../session/session.service';
import { UserResponse } from '../user/response/user.response';
import { UserService } from '../user/user.service';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from './constants/env-variables';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/cookie';
import { User } from '../user/entities/user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private sessionService: SessionService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    const user = await this.userService.getUserByEmail(email);

    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException(ExceptionMessage.invalidCredentials);
    }

    return user;
  }

  async register(registrationDto: UserRegistrationDto): Promise<void> {
    await this.userService.create(registrationDto);
  }

  async login(req: RequestWithUser): Promise<UserLoginResponse> {
    const user = await this.userService.getUserById(req.user.id);

    const { accessTokenCookie, token: accessToken } = this.getAccessJwtToken(
      req.user.id,
    );
    const { refreshTokenCookie, token: refreshToken } =
      this.getCookieWithJwtRefreshToken(req.user.id);

    await this.sessionService.createOrUpdateSessionByUserId(
      req.user.id,
      refreshToken,
    );

    req.res?.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return {
      accessToken,
      refreshToken,
      user: new UserResponse(user),
    };
  }

  getAccessJwtToken(userId: number): CookieWithAccessToken {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(JWT_ACCESS_TOKEN_SECRET),
      expiresIn: `${this.configService.get(JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`,
    });

    const accessTokenCookie = cookie.serialize(ACCESS_TOKEN, token, {
      httpOnly: true,
      path: '/',
      maxAge: this.configService.get(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    });

    return { token, accessTokenCookie };
  }

  getCookieWithJwtRefreshToken(userId: number): CookieWithRefreshToken {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(JWT_REFRESH_TOKEN_SECRET),
      expiresIn: `${this.configService.get(
        JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      )}s`,
    });

    const refreshTokenCookie = cookie.serialize(REFRESH_TOKEN, token, {
      httpOnly: true,
      path: '/',
      maxAge: this.configService.get(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    });

    return {
      refreshTokenCookie,
      token,
    };
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const refreshTokenFromDB = await this.sessionService.getRefreshToken(
      userId,
    );

    if (refreshToken !== refreshTokenFromDB) {
      throw new ForbiddenException(ExceptionMessage.tokensNotMatch);
    }

    return await this.userService.getUserById(userId);
  }

  async refresh(req: RequestWithUser): Promise<void> {
    const { accessTokenCookie } = this.getAccessJwtToken(req.user.id);

    const { refreshTokenCookie, token: refreshToken } =
      this.getCookieWithJwtRefreshToken(req.user.id);

    await this.sessionService.createOrUpdateSessionByUserId(
      req.user.id,
      refreshToken,
    );

    req.res?.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);

    const { token } = this.getAccessJwtToken(user.id);
    const link = `${this.configService.get(
      APP_URL,
    )}/api/auth/reset-password?token=${token}`;

    await this.mailService.sendLinkToResetPasword(user.email, link);
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get(JWT_ACCESS_TOKEN_SECRET),
      });

      const user = await this.userService.getUserById(userId);

      user.password = await bcrypt.hash(
        password,
        Number(this.configService.get(SALT)),
      );

      await this.userService.update(userId, user);
    } catch (error) {
      throw new BadRequestException(ExceptionMessage.tokenTimeout);
    }
  }
}
