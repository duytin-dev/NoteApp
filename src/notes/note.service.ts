import { CreateNoteDto } from './dto/req/create.notedto';
import { UpdateNoteDto } from './dto/req/update.notedto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

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

    const note = this.noteRepository.create({
      title,
      content,
      user,
    });

    const saved = await this.noteRepository.save(note);
    return this.toSafeNote(saved);
  }

  async findAll() {
    const notes = await this.noteRepository.find({
      relations: { user: true },
    });
    return notes.map((note) => this.toSafeNote(note));
  }

  async findOne(id: number) {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.toSafeNote(note);
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
    return this.toSafeNote(saved);
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

  private toSafeNote(note: Note) {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      created_At: note.created_At,
      updated_At: note.updated_At,
      user: note.user
        ? {
            id: note.user.id,
            name: note.user.name,
            email: note.user.email,
          }
        : undefined,
    };
  }
}
