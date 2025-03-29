import { IsEmail, Length, IsOptional, IsString } from 'class-validator';

export class SignupUserResponse {
  id: number;

  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsEmail()
  @Length(1, 200)
  about: string;

  @IsOptional()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  createdAt: Date;

  updatedAt: Date;
}
