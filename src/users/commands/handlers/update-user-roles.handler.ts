import { CommandHandler } from '@nestjs/cqrs';
import { UpdateUserRolesCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../auth/entities/user.entity';

@CommandHandler(UpdateUserRolesCommand)
export class UpdateUserRolesHandler
  implements ICommandHandler<UpdateUserRolesCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: UpdateUserRolesCommand) {
    const { id, updateRolesDto } = command;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.roles = updateRolesDto.roles;
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
}
