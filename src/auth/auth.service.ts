import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/user.service';
import { RegisterRequest } from './dto/req/register.dto.req';
import { LoginRequest } from './dto/req/login.dto.req';
import { RegisterDtoResponse } from './dto/res/register.dto.res';
import { LoginDtoResponse } from './dto/res/login.dto.res';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,) {}

  async register(
    registerRequest: RegisterRequest,
  ): Promise<RegisterDtoResponse> {
    const existUser = await this.userService.findByEmail(registerRequest.email);

    if (existUser) {
      throw new ConflictException('User have already exist !');
    }

    const passwordHash = bcrypt.hashSync(registerRequest.password, 10);
    const user = await this.userService.create({
      name: registerRequest.name,
      email: registerRequest.email,
      password: passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(loginRequest: LoginRequest): Promise<LoginDtoResponse> {
    const user = await this.userService.findByEmail(loginRequest.email);

    if (!user) {
      throw new BadRequestException('Account do not register !');
    }
    const payload = {
      sub: user.id,
      email: user.email,
    }
    const accessToken =  await this.jwtService.signAsync(payload);
    
    const loginDtoResponse: LoginDtoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: accessToken,

    }
   
    return loginDtoResponse;
  }
}
