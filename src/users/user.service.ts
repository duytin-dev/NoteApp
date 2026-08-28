import { UpdateUserDto } from './dto/req/update.user.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserResponse } from './dto/res/user.res';
import { UserPaginate } from './dto/res/user.page.res';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(userData: { name: string; email: string; password: string }) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserResponse[]> {

    const users = await this.userRepository.find();
    return users.map((user) => this.toUserResponse(user));
  }
  async paginate(query): Promise<UserPaginate> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = query.keyword || '';

    const [result, total] = await this.userRepository.findAndCount({
      where: {
        name: Like(`%${keyword}%`),
      },
      order: {
        name: 'DESC',
      },
      take: limit,
      skip: skip,
    });

    return {
      data: result.map((user) => this.toUserResponse(user)),
      count: total,
    };
  }


  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { notes: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserResponse(user);

  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existUser) {
        throw new ConflictException('User have already exist !');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const userSaved = await this.userRepository.save(user);

    return this.toUserResponse(userSaved);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}
