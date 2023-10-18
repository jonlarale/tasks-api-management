import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { DeleteTaskCommand } from '../impl/delete-task.command';
import { Task } from '../../entities/task.entity';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(command: DeleteTaskCommand) {
    const { id, userId } = command;
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId,
      },
    });
    if (!task) {
      throw new RpcException({
        error: 'Not Found',
        message: 'No Task with this ID found',
        statusCode: 404,
      });
    }
    await this.taskRepository.remove(task);
  }
}
