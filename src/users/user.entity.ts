import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Note } from '../notes/note.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @OneToMany(() => Note, (note) => note.user)
  notes!: Note[];
}
