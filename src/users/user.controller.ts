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
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UserQueryDto } from './dto/req/user.query.dto';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../enum/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
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
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
