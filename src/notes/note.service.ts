import { CreateNoteDto } from './dto/req/create.note.dto';
import { UpdateNoteDto } from './dto/req/update.note.dto';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Like, Not, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ApiResponse } from '../utils/api.res';
import { NoteResponse } from './dto/res/note.res';
import { NotePaginate } from './dto/res/note.page.res';
import { NoteQueryDto } from './dto/req/note.query.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

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

  async findAll(
    userId: number,
    query: NoteQueryDto,
  ): Promise<NotePaginate> {
    const { page, limit, keyword } = query;

    const skip = (page - 1) * limit;

    const [notes, total] = await this.noteRepository.findAndCount({
      where: {
        user: { id: userId },
        ...(keyword
          ? {
            title: Like(`%${keyword}%`),
          }
          : {}),
      },
      order: {
        title: 'DESC',
      },
      relations: {
        user: true,
      },
      take: limit,
      skip,
    });

    return {
      data: notes.map((note) => this.toNoteResponse(note)),
      count: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

  async update(id: number, userId: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { user: true },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
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

  async remove(id: number, userId: number) {
    const note = await this.noteRepository.findOne({ where: { id, user: { id: userId } } });

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

  async completeNote(id: number, userId: number) {
    let check: boolean = false;
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
      relations: {
        user: true,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (note.isCompleted === false) {
      note.isCompleted = true;
      check = true;
    } else {
      note.isCompleted = false;
      check = false;
    }

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
