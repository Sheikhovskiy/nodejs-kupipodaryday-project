import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UsersMapper } from '../users/dto/users.mapper';
import { User } from '../users/entities/user.entity';
import { SigninUserDto } from '../users/dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersSevice: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(signinUserDto: SigninUserDto) {
    const { username, password } = signinUserDto;
    const user = await this.validate(username, password);
    return this.auth(user);
  }

  auth(user: Omit<User, 'password'>) {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    const user = await this.usersSevice.create(createUserDto);
    return UsersMapper.fromUserToSignupUserResponse(user);
  }

  async validate(username: string, password: string) {
    const user = await this.usersSevice.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new UnauthorizedException(`Некорректная пара логин и пароль`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Некорректная пара логин и пароль`);
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
