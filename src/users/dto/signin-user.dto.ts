import { Length, MinLength, IsString } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @MinLength(2)
  password: string;
}
