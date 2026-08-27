import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/req/login.dto.req';
import { RegisterRequest } from './dto/req/register.dto.req';
import { ApiResponse } from '../utils/api.res';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterRequest) {
    const user = await this.authService.register(registerRequest);
    return new ApiResponse('Register successfully', 'success', user);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginRequest: LoginRequest) {
    const user = await this.authService.login(loginRequest);
    return new ApiResponse('Login successfully', 'success', user);
  }
}
