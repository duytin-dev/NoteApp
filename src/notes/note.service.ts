import { CreateNoteDto } from './dto/req/create.note.dto';
import { UpdateNoteDto } from './dto/req/update.note.dto';
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
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
    if(!user) throw new BadGatewayException(`User by id ${userId} not does not exist !`);

    const note = this.noteRepository.create({
      title,
      content,
      user,
    });

    const savedNote = await this.noteRepository.save(note);
    const noteResponse : NoteResponse = {
       id: savedNote.id,
       title: savedNote.title,
       content: savedNote.content,
       userId:savedNote.user.id,
       created_At : savedNote.created_At,
       updated_At: savedNote.updated_At,
       isCompleted: savedNote.isCompleted,

    }
    return noteResponse;
  } 

  async findAll(): Promise<NoteResponse[]> {
    const notes = await this.noteRepository.find({
      relations: { user: true },
    });
    return notes.map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      userId: note.user.id,
      created_At: note.created_At,
      updated_At: note.updated_At,
      isCompleted: note.isCompleted,
    }));
  }

  async findOne(id: number) {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const noteResponse : NoteResponse = {
       id: note.id,
       title: note.title,
       content: note.content,
       userId:note.user.id,
       created_At : note.created_At,
       updated_At: note.updated_At,
       isCompleted:note.isCompleted,

    }
    return noteResponse;
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
    
     const noteResponse : NoteResponse = {
       id: saved.id,
       title: saved.title,
       content: saved.content,
       userId:saved.user.id,
       created_At : saved.created_At,
       updated_At: saved.updated_At,
       isCompleted: saved.isCompleted,

    }
    return noteResponse;
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

 const savedNote =  await this.noteRepository.save(note);

  const noteResponse: NoteResponse = {
    id: savedNote .id,
    title: savedNote .title,
    content: savedNote .content,
    userId: savedNote .user.id,
    created_At: savedNote .created_At,
    updated_At: savedNote .updated_At,
    isCompleted: savedNote .isCompleted,
  };

  return noteResponse;
}
}
