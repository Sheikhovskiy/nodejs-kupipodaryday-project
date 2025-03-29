import { IsEmail, Length, IsOptional, IsString } from 'class-validator';

export class UserProfileResponseDto {
  id: number;

  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsString()
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
