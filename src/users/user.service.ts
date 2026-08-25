import { CreateUserDto } from './dto/req/create.user.dto';
import { UpdateUserDto } from './dto/req/update.user.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, password, email } = createUserDto;
    const existUser = await this.userRepository.findOne({ where: { email } });

    if (existUser) {
      throw new ConflictException('User have already exist !');
    }

    const user = this.userRepository.create({ name, password, email });
    const saved = await this.userRepository.save(user);
    return this.toSafeUser(saved);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { notes: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toSafeUser(user);
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

    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    return this.toSafeUser(saved);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  private toSafeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      notes: user.notes,
    };
  }
}
