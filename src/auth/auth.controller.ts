import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SigninUserDto } from '../users/dto/signin-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.CREATED)
  async signin(@Body() signinUserDto: SigninUserDto) {
    return await this.authService.signin(signinUserDto);
  }
}
