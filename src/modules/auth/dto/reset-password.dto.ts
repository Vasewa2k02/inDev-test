import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { InfoMessage } from 'src/common/enums/info-message.enum';

export class UserResetPasswordDto {
  @ApiProperty()
  @Matches(
    /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zА-Яа-я\d@$!%*?&]{8,}$/,
    {
      message: InfoMessage.passwordValidation,
    },
  )
  password: string;
}
