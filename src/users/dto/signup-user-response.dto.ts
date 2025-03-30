import {
  IsEmail,
  Length,
  IsOptional,
  IsString,
  IsUrl,
  IsDate,
} from 'class-validator';

export class SignupUserResponse {
  id: number;

  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsEmail()
  @Length(1, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
