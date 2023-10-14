import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import {
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
} from './commands/handlers';
import { GetTasksHandler, GetTaskHandler } from './queries/handlers';

export const CommandHandlers = [
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
];
export const QueryHandlers = [GetTasksHandler, GetTaskHandler];

@Module({
  controllers: [TasksController],
  providers: [...CommandHandlers, ...QueryHandlers],
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule,
    ConfigModule,
    CqrsModule,
  ],
})
export class TasksModule {}
