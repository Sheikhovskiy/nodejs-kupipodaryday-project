import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  controllers: [UsersController],
  providers: [UsersService, WishesService],
  exports: [UsersService, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
