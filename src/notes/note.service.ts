import { CreateNoteDto } from './dto/req/create.note.dto';
import { UpdateNoteDto } from './dto/req/update.note.dto';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Not, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ApiResponse } from '../utils/api.res';
import { NoteResponse } from './dto/res/note.res';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    const { title, content, userId } = createNoteDto;
    const user = await this.findUser(userId);
    if (!user)
      throw new NotFoundException(
        `User by id ${userId} not does not exist !`,
      );

    const note = this.noteRepository.create({
      title,
      content,
      user,
    });

    const savedNote = await this.noteRepository.save(note);

    return this.toNoteResponse(savedNote);
  }

  async findAll(): Promise<NoteResponse[]> {
    const notes = await this.noteRepository.find({
      relations: { user: true },
    });
    return notes.map((note) => this.toNoteResponse(note));
  }

  async findOne(id: number) {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.toNoteResponse(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (updateNoteDto.userId) {
      note.user = await this.findUser(updateNoteDto.userId);
    }

    if (updateNoteDto.title !== undefined) {
      note.title = updateNoteDto.title;
    }

    if (updateNoteDto.content !== undefined) {
      note.content = updateNoteDto.content;
    }

    const saved = await this.noteRepository.save(note);

    return this.toNoteResponse(saved);
  }

  async remove(id: number) {
    const note = await this.noteRepository.findOne({ where: { id } });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    await this.noteRepository.remove(note);
    return { message: 'Note deleted successfully' };
  }

  private async findUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async completeNote(id: number) {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note.isCompleted = true;
    const savedNote = await this.noteRepository.save(note);
    return this.toNoteResponse(savedNote);
  }

  private toNoteResponse(note: Note): NoteResponse {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      userId: note.user.id,
      created_At: note.created_At,
      updated_At: note.updated_At,
      isCompleted: note.isCompleted,
    };
  }
}
