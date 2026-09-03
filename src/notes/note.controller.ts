import { User } from './../users/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/req/create.note.dto';
import { UpdateNoteDto } from './dto/req/update.note.dto';
import { ApiResponse } from '../utils/api.res';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { NoteQueryDto } from './dto/req/note.query.dto';
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) { }



  @Get()
  @HttpCode(200)
  async findAll(@Request() req, @Query() query: NoteQueryDto) {
    //console.log(req.user.userId);
    return this.noteService.findAll(req.user.userId, query);

  }

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(createNoteDto);

  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.findOne(id);

  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, @Request() req,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteService.update(id, req.user.userId, updateNoteDto);

  }
  @Patch(':id/complete')
  async checkComplete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.noteService.completeNote(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.noteService.remove(id, req.user.userId);
  }
}
