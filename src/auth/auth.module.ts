import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { CreateUserHandler, LoginUserHandler } from './commands/handlers';
import { GetUserHandler } from './queries/handlers';

export const CommandHandlers = [CreateUserHandler, LoginUserHandler];
export const QueryHandlers = [GetUserHandler];

@Module({
  controllers: [AuthController],
  providers: [JwtStrategy, ...CommandHandlers, ...QueryHandlers],
  imports: [
    ConfigModule,
    CqrsModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
