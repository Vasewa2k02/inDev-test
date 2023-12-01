import { ApiProperty } from '@nestjs/swagger';

import { Role } from 'src/common/enums/role.enum';

import { UserResponseType } from '../types.ts/user-response.type';
import { User } from '../entities/user.entity';

export class UserResponse implements UserResponseType {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: Role;
}
