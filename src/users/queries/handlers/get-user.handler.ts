import { IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { QueryHandler } from '@nestjs/cqrs';

import { User } from '../../../auth/entities/user.entity';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetUserQuery) {
    const { id } = query;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new RpcException({
        error: 'Not Found',
        message: 'No User with this ID found',
        statusCode: 404,
      });
    }
    return user;
  }
}
