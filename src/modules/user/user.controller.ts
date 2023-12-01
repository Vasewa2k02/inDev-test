import { Controller, Get, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Role } from 'src/common/enums/role.enum';
import { AuthWithRoles } from 'common/decorators/auth-with-roles.decorator';

import { UserService } from './user.service';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { UserResponse } from './response/user.response';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Проверка авторизации' })
  @ApiCookieAuth()
  @AuthWithRoles(Role.user)
  @Get('profile')
  getUserInfo(@Req() req: RequestWithUser): Promise<UserResponse> {
    return this.userService.getUserInfo(req.user.id);
  }
}
