import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { CustomRequest } from '../users/CustomRequest';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    req: CustomRequest,
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    createWishDto.owner = parseInt(req.user.id);

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

  async getLastWish() {
    return await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner'],
    });
  }

  async getTop() {
    return await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: ['owner'],
    });
  }

  async getById(req: CustomRequest, id: string): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException(`Желание с id: ${id} не найдено`);
    }

    return wish;
  }

  async update(
    req: CustomRequest,
    id: string,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const userId = parseInt(req.user.id);

    const existingWish = await this.wishRepository.findOne({
      where: {
        id: parseInt(id),
        owner: { id: parseInt(req.user.id) },
      },
      relations: ['offers', 'owner'],
    });

    if (!existingWish) {
      throw new NotFoundException(`У вас не существует такого желания`);
    }

    if (existingWish.price !== updateWishDto.price) {
      if (existingWish?.offers.length > 0) {
        throw new ConflictException(
          `Нельзя изменять цену, когда уже есть желающие скинуться`,
        );
      }
    }

    if (updateWishDto.raised && existingWish.raised !== updateWishDto.raised) {
      throw new ForbiddenException(
        `Сумма собранных средств формируется автоматически и не может быть изменена`,
      );
    }

    const where: FindOptionsWhere<Wish> = {
      id: parseInt(id),
      owner: { id: userId },
    };

    await this.wishRepository.update(where, updateWishDto);

    const updatedWish = await this.wishRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!updatedWish) {
      throw new NotFoundException(`Желание с id: ${id} не найдено`);
    }

    return updatedWish;
  }

  async delete(req: CustomRequest, id: string) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wish = await this.wishRepository.findOne({
      where: {
        id: parseInt(id),
        owner: { id: parseInt(req.user.id) },
      },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException(`Желание с id: ${id} не найдено`);
    }

    const deleteQuery: FindOptionsWhere<Wish> = {
      id: parseInt(id),
    };

    await this.wishRepository.delete(deleteQuery);

    return wish;
  }

  async copy(req: CustomRequest, id: string): Promise<Wish> {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wish = await this.wishRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден или это ваш собственный');
    }

    await this.wishRepository.update(
      { id: parseInt(id) },
      { copied: (wish.copied || 0) + 1 },
    );

    const { id: _, owner: __, ...wishData } = wish;

    const createWishDto: CreateWishDto = {
      ...wishData,
      owner: parseInt(req.user.id),
    };

    return await this.create(req, createWishDto);
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
