import { CommandHandler } from '@nestjs/cqrs';
import { ActivateUserCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../auth/entities/user.entity';

@CommandHandler(ActivateUserCommand)
export class ActivateUserHandler
  implements ICommandHandler<ActivateUserCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: ActivateUserCommand) {
    const { id, status } = command;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new RpcException({
        error: 'Not Found',
        message: 'No User with this ID found',
        statusCode: 404,
      });
    }
    user.activated = status;
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
}
