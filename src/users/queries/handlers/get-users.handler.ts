import { QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../impl';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

import { User } from '../../../auth/entities/user.entity';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: GetUsersQuery) {
    const { paginationDto } = query;
    const {
      limit = this.configService.get('paginationLimit'),
      offset = this.configService.get('paginationOffset'),
    } = paginationDto;
    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }
}
