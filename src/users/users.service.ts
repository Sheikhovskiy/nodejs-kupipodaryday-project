import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
