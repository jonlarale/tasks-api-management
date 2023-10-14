// Nestjs
import { Response as ExpressResponse } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Response,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

// Tasks
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from './commands/impl/create-task.command';
import { UpdateTaskCommand } from './commands/impl/update-task.command';
import { DeleteTaskCommand } from './commands/impl/delete-task.command';
import { GetTasksQuery } from './queries/impl/get-tasks.query';
import { GetTaskQuery } from './queries/impl/get-task.query';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Auth
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';

// Common
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Task } from './entities/task.entity';
import { ErrorResponseDto } from 'src/common/dtos/error-response.dto';

@ApiTags('Tasks')
@Controller('tasks')
@Auth(ValidRoles.USER)
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser(['id']) userId: string,
  ) {
    return this.commandBus.execute(
      new CreateTaskCommand(createTaskDto, userId),
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    type: [Task],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser(['id']) userId: string,
  ) {
    return this.queryBus.execute(new GetTasksQuery(paginationDto, userId));
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser(['id']) userId: string,
  ) {
    return this.queryBus.execute(new GetTaskQuery(id, userId));
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser(['id']) userId: string,
  ) {
    return this.commandBus.execute(
      new UpdateTaskCommand(id, updateTaskDto, userId),
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully',
    type: null,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser(['id']) userId: string,
    @Response() res: ExpressResponse,
  ) {
    await this.commandBus.execute(new DeleteTaskCommand(id, userId));
    res.status(204).send();
  }
}
