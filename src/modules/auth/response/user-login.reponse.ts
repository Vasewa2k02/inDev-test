import { ApiProperty } from '@nestjs/swagger';

import { UserResponse } from 'modules/user/response/user.response';

export class UserLoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: UserResponse;
}
