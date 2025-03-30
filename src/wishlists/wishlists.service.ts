import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { CustomRequest } from '../users/CustomRequest';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    req: CustomRequest,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }
    const userId = parseInt(req.user.id);

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

  async getUserWishlist(req: CustomRequest): Promise<Wishlist[]> {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    return await this.wishlistRepository.find({
      where: { owner: { id: parseInt(req.user.id) } },
      relations: ['owner', 'items'],
    });
  }

  async update(
    req: CustomRequest,
    id: string,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wishlist = await this.wishlistRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!wishlist) return;

    if (wishlist.owner.id !== parseInt(req.user.id)) return;

    const updateQuery: FindOptionsWhere<Wishlist> = {
      id: parseInt(req.user.id),
    };

    return await this.wishlistRepository.update(updateQuery, updateWishlistDto);
  }

  async delete(req: CustomRequest, id: string) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id: parseInt(id),
        owner: { id: parseInt(req.user.id) },
      },
    });

    if (!wishlist) {
      throw new NotFoundException(`Список пожеланий с id: ${id} не найден`);
    }

    const deleteQuery: FindOptionsWhere<Wishlist> = {
      id: parseInt(id),
      owner: { id: parseInt(req.user.id) },
    };

    return await this.wishlistRepository.delete(deleteQuery);
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
