import { IsEmail, IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.',
    },
  )
  readonly password: string;
  @IsInt()
  readonly age: number;
  @IsString()
  readonly phone: string;
}
