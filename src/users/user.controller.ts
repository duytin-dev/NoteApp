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
  Query, Request,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/req/update.user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/strategies/jwt.auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @HttpCode(200)
  async findAll(@Request() req) {
    return this.userService.findAll();
  }
  @Get('/paginate')
  @HttpCode(200)
  async paginate(@Query() query) {
    return this.userService.paginate(query);
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);

  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);

  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
