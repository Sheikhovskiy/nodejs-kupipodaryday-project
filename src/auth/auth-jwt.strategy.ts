import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secretOrKey = configService.get<string>('JWT_SECRET_KEY');
    if (!secretOrKey) {
      throw new Error('JWT_SECRET_KEY нет в конфиге');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretOrKey,
      passReqToCallback: false,
    } satisfies StrategyOptionsWithoutRequest);
  }

  async validate(payload: { id: number }) {
    const user = await this.usersService.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password: _, ...safeUser } = user;

    return safeUser;
  }
}
