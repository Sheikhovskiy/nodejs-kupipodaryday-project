import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomRequest } from './CustomRequest';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userWithSameEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userWithSameEmail) {
      throw new ConflictException(
        `Пользователь с таким email или username уже зарегистрирован`,
      );
    }

    const userWithSameUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (userWithSameUsername) {
      throw new ConflictException(
        `Пользователь с таким email или username уже зарегистрирован`,
      );
    }

    const createdUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(createdUser);
  }

  async getMe(req: CustomRequest): Promise<User> {
    if (!req.user?.id)
      throw new UnauthorizedException(`Пользователь не найден`);

    const user = await this.userRepository.findOne({
      where: { id: parseInt(req.user.id) },
      relations: [
        'wishes',
        'wishes.owner',
        'offers',
        'offers.item',
        'wishlists',
      ],
    });

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return user;
  }

  async updateProfile(req: CustomRequest, updateUserDto: UpdateUserDto) {
    if (!req.user?.id) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    await this.userRepository.update(
      { id: parseInt(req.user.id) },
      updateUserDto,
    );

    const updatedUser = await this.userRepository.findOne({
      where: { id: parseInt(req.user.id) },
    });

    if (!updatedUser) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return updatedUser;
  }

  async getMyWishes(req: CustomRequest): Promise<Wish[]> {
    if (!req.user?.id)
      throw new UnauthorizedException(`Пользователь не найден`);

    const userId =
      typeof req.user?.id === 'string' ? parseInt(req.user.id) : req.user.id;

    const where: FindOptionsWhere<Wish> = {
      owner: { id: userId },
    };

    return await this.wishRepository.find({
      where,
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
    });
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return user;
  }

  async getUserWishes(username: string): Promise<Wish[]> {
    return await this.wishRepository.find({
      where: { owner: { username: username } },
    });
  }

  async findByQuery(findUsersDto: FindUsersDto): Promise<User[]> {
    const query = findUsersDto.query;

    return await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  async findOne(query: FindManyOptions<User>): Promise<User | null> {
    return await this.userRepository.findOne(query);
  }

  async findMany(query: FindManyOptions<User>): Promise<User[] | []> {
    return await this.userRepository.find(query);
  }

  async updateOne(
    query: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.userRepository.update(query, updateUserDto);
  }

  async removeOne(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
