import {
  IsEmail,
  Length,
  IsOptional,
  MinLength,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(0, 200)
  @IsOptional()
  about: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
