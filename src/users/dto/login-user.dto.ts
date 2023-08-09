import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail(undefined, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'an $property is required to log in' })
  email: string;

  @ApiProperty()
  @IsString({ message: '$property must be a string' })
  @IsNotEmpty({ message: '$property is required to log in' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&]{8,15}/,
    {
      message:
        'The $property The password must be 8 to 15 characters long, contain a capital letter, a lower case letter, a number and a special character.',
    },
  )
  password: string;
}
