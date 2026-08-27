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
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/req/create.note.dto';
import { UpdateNoteDto } from './dto/req/update.note.dto';
import { ApiResponse } from '../utils/api.res';
import { JwtAuthGuard } from '../auth/strategies/jwt.auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    const note = await this.noteService.create(createNoteDto);
    return new ApiResponse('Create note successfully !', 'suceess', note);
  }

  @Get()
  @HttpCode(200)
  async findAll() {
    const listNotes = await this.noteService.findAll();
    return new ApiResponse(
      'Fetch all notes successfully !',
      'success',
      listNotes,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const note = await this.noteService.findOne(id);
    return new ApiResponse('Fetch note by id successfully', 'success', note);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const note = await this.noteService.update(id, updateNoteDto);
    return new ApiResponse('Update note successfully !', 'sucess', note);
  }
  @Patch(':id/complete')
  async checkComplete(@Param('id', ParseIntPipe) id: number) {
    const checkNote = await this.noteService.completeNote(id);
    return new ApiResponse(
      'Note have already completed!',
      'success',
      checkNote,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.remove(id);
  }
}
