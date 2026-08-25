import { NoteModule } from './notes/note.module';
import { UserModule } from './users/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'noteapp',
      autoLoadEntities: true,
      synchronize: true,
    }),
  UserModule,
 NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
 
})
export class AppModule {}
