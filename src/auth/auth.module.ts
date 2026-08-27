import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { JwtAuthGuard } from './strategies/jwt.auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [ UserModule,


    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow<string>('JWT_SECRET'),
            signOptions: {
                expiresIn: configService.getOrThrow<StringValue>('JWT_EXPIRES_IN'),
            },
        }),
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
