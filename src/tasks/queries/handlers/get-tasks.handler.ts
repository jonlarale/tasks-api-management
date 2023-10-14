import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { GetTasksQuery } from '../impl/get-tasks.query';
import { Task } from '../../entities/task.entity';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: GetTasksQuery) {
    const { paginationDto, userId } = query;
    const {
      limit = this.configService.get('paginationLimit'),
      offset = this.configService.get('paginationOffset'),
    } = paginationDto;
    return this.taskRepository.find({
      skip: offset,
      take: limit,
      where: {
        userId,
      },
    });
  }
}
