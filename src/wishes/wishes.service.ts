import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    const owner = await this.userRepository.findOne({
      where: { id: createWishDto.owner },
    });

    if (!owner) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: owner,
      raised: 0,
    });

    return await this.wishRepository.save(wish);
  }

  async findOne(query: FindManyOptions<Wish>): Promise<Wish | null> {
    return await this.wishRepository.findOne(query);
  }

  async findAll(query: FindManyOptions<Wish>): Promise<Wish[]> {
    return await this.wishRepository.find(query);
  }

  async updateOne(
    query: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
  ): Promise<void> {
    await this.wishRepository.update(query, updateWishDto);
  }

  async removeOne(query: FindOptionsWhere<Wish>): Promise<void> {
    await this.wishRepository.delete(query);
  }
}
