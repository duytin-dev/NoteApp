import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Note } from '../notes/note.entity';
import { Role } from '../enum/role.enum';

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

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role!: Role;

  @OneToMany(() => Note, (note) => note.user)
  notes!: Note[];
}
