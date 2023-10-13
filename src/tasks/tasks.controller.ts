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
import { Response as ExpressResponse } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('tasks')
@Auth(ValidRoles.USER)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser(['id']) userId: string,
  ) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser(['id']) userId: string,
  ) {
    return this.tasksService.findAll(paginationDto, userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser(['id']) userId: string,
  ) {
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser(['id']) userId: string,
  ) {
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser(['id']) userId: string,
    @Response() res: ExpressResponse,
  ) {
    await this.tasksService.remove(id, userId);
    res.status(204).send();
  }
}
