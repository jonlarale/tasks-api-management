import { CommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../auth/entities/user.entity';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: DeleteUserCommand) {
    const { id } = command;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new RpcException({
        error: 'Not Found',
        message: 'No User with this ID found',
        statusCode: 404,
      });
    }
    await this.userRepository.remove(user);
  }
}
