import { CommandHandler } from '@nestjs/cqrs';
import { ActivateUserCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.activated = status;
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
}
