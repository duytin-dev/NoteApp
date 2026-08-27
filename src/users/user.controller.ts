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
} from '@nestjs/common';
import { UpdateUserDto } from './dto/req/update.user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    const listUser = await this.userService.findAll();
    return new ApiResponse('Fetch list user successfully', 'success', listUser);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const userResponse = await this.userService.findOne(id);
    return new ApiResponse(
      'Fetch user by id successfully',
      'success',
      userResponse,
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return new ApiResponse('Update user successfully', 'success', user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
