// Nestjs
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

// Tasks
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from './commands/impl/create-task.command';
import { UpdateTaskCommand } from './commands/impl/update-task.command';
import { DeleteTaskCommand } from './commands/impl/delete-task.command';
import { GetTasksQuery } from './queries/impl/get-tasks.query';
import { GetTaskQuery } from './queries/impl/get-task.query';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Common
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TaskCmd } from './enums/task-cmd.enum';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(TaskCmd.CREATE)
  public create(data: { createTaskDto: CreateTaskDto; userId: string }) {
    const { createTaskDto, userId } = data;
    return this.commandBus.execute(
      new CreateTaskCommand(createTaskDto, userId),
    );
  }

  @MessagePattern(TaskCmd.GET_ALL)
  public findAll(data: { paginationDto: PaginationDto; userId: string }) {
    const { paginationDto, userId } = data;
    return this.queryBus.execute(new GetTasksQuery(paginationDto, userId));
  }

  @MessagePattern(TaskCmd.GET_ONE)
  public findOne(data: { id: string; userId: string }) {
    const { id, userId } = data;
    return this.queryBus.execute(new GetTaskQuery(id, userId));
  }

  @MessagePattern(TaskCmd.UPDATE)
  public update(data: {
    id: string;
    updateTaskDto: UpdateTaskDto;
    userId: string;
  }) {
    const { id, updateTaskDto, userId } = data;
    return this.commandBus.execute(
      new UpdateTaskCommand(id, updateTaskDto, userId),
    );
  }

  @MessagePattern(TaskCmd.DELETE)
  public remove(data: { id: string; userId: string }) {
    const { id, userId } = data;
    this.commandBus.execute(new DeleteTaskCommand(id, userId));
  }
}
