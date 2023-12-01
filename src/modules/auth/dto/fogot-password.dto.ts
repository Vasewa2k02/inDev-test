import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { InfoMessage } from 'src/common/enums/info-message.enum';

export class UserForgotPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: InfoMessage.emailValidation })
  email: string;
}
