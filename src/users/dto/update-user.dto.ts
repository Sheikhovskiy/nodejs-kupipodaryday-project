import {
  IsEmail,
  Length,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsOptional()
  @Length(1, 200)
  about: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  password: string;
}
