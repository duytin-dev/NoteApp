import { ApiResponse } from './../utils/api.res';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/req/update.user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/strategies/jwt.auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    return  this.userService.findAll();
    
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return  this.userService.findOne(id);
   
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return  this.userService.update(id, updateUserDto);
   
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
