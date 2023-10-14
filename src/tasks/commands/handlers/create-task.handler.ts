import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';

import { CreateTaskCommand } from '../impl/create-task.command';
import { Task } from '../../entities/task.entity';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  private readonly logger = new Logger('CreateTaskHandler');

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(command: CreateTaskCommand) {
    const { createTaskDto, userId } = command;
    try {
      createTaskDto['userId'] = userId;
      const task = this.taskRepository.create(createTaskDto);
      await this.taskRepository.save(task);

      return task;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
