import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { UpdateTaskCommand } from '../impl/update-task.command';
import { Task } from '../../entities/task.entity';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(command: UpdateTaskCommand) {
    const { id, updateTaskDto, userId } = command;
    const task = await this.taskRepository.preload({
      id: id,
      ...updateTaskDto,
      userId: userId,
    });
    if (!task) {
      throw new RpcException({
        error: 'Not Found',
        message: 'No Task with this ID found',
        statusCode: 404,
      });
    }
    await this.taskRepository.save(task);
    return task;
  }
}
