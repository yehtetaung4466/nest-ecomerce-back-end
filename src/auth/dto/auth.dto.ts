import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LogInDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class SignInDto extends LogInDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
