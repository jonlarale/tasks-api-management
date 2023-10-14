import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UpdateUserHandler,
  DeleteUserHandler,
  ActivateUserHandler,
  UpdateUserRolesHandler,
} from './commands/handlers';

import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { User } from '../auth/entities/user.entity';
import { GetUsersHandler, GetUserHandler } from './queries/handlers';

export const CommandHandlers = [
  UpdateUserHandler,
  DeleteUserHandler,
  ActivateUserHandler,
  UpdateUserRolesHandler,
];
export const QueryHandlers = [GetUsersHandler, GetUserHandler];
@Module({
  controllers: [UsersController],
  providers: [...CommandHandlers, ...QueryHandlers],
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    ConfigModule,
    CqrsModule,
  ],
})
export class UsersModule {}
