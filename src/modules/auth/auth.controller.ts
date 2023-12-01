import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { swaggerType } from 'src/helpers/swagger/utils';

import { RequestWithUser } from './types/request-with-user.interface';
import { AuthService } from './auth.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import JwtRefreshGuard from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UserLoginResponse } from './response/user-login.reponse';
import { UserLoginDto } from './dto/user-login.dto';
import { UserForgotPasswordDto } from './dto/fogot-password.dto';
import { UserResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  register(@Body() registrationDto: UserRegistrationDto): Promise<void> {
    return this.authService.register(registrationDto);
  }

  @ApiOkResponse(swaggerType(UserLoginResponse))
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  login(
    @Req() req: RequestWithUser,
    @Body() userLoginDto: UserLoginDto,
  ): Promise<UserLoginResponse> {
    return this.authService.login(req);
  }

  @ApiOkResponse()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: RequestWithUser): Promise<void> {
    return this.authService.refresh(req);
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(
    @Body() userForgotPasswordDto: UserForgotPasswordDto,
  ): Promise<void> {
    return this.authService.forgotPassword(userForgotPasswordDto.email);
  }

  @ApiOkResponse()
  @ApiQuery({
    name: 'token',
    description: 'Токен из сообщения на почте',
    required: true,
  })
  @Patch('reset-password')
  resetPassword(
    @Query('token') token: string,
    @Body() userResetPasswordDto: UserResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(token, userResetPasswordDto.password);
  }
}
