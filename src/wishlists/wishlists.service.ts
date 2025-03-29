import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const owner = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!owner) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: owner,
    });

    return await this.wishlistRepository.save(wishlist);
  }

  async findOne(query: FindManyOptions<Wishlist>): Promise<Wishlist | null> {
    return await this.wishlistRepository.findOne(query);
  }

  async findAll(query: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return await this.wishlistRepository.find(query);
  }

  async updateOne(
    query: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<UpdateResult> {
    return await this.wishlistRepository.update(query, updateWishlistDto);
  }

  async removeOne(query: FindOptionsWhere<Wishlist>): Promise<void> {
    await this.wishlistRepository.delete(query);
  }
}
