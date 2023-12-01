import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { InfoMessage } from 'src/common/enums/info-message.enum';

export class UserLoginDto {
  @ApiProperty()
  @IsEmail({}, { message: InfoMessage.emailValidation })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: InfoMessage.passwordEmpty })
  password: string;
}
