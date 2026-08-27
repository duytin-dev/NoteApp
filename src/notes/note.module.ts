import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, User])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
