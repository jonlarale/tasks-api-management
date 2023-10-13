import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  private readonly logger = new Logger('TasksService');

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    private readonly configService: ConfigService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
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

  findAll(paginationDto: PaginationDto, userId: string) {
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

  async findOne(id: string, userId: string) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.taskRepository.preload({
      id: id,
      ...updateTaskDto,
      userId: userId,
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    await this.taskRepository.save(task);
    return task;
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }
}
