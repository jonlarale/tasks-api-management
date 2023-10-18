import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { GetTaskQuery } from '../impl/get-task.query';
import { Task } from '../../entities/task.entity';

@QueryHandler(GetTaskQuery)
export class GetTaskHandler implements IQueryHandler<GetTaskQuery> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(query: GetTaskQuery) {
    const { id, userId } = query;
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
    return task;
  }
}
