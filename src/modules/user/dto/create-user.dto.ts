import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { CreateUserType } from '../types.ts/create-user.type';
import { InfoMessage } from 'src/common/enums/info-message.enum';

export class CreateUserDto implements CreateUserType {
  @ApiProperty()
  @IsEmail({}, { message: InfoMessage.emailValidation })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: InfoMessage.nameEmpty })
  name: string;

  @ApiProperty()
  @Matches(
    /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zА-Яа-я\d@$!%*?&]{8,}$/,
    {
      message: InfoMessage.passwordValidation,
    },
  )
  password: string;
}
