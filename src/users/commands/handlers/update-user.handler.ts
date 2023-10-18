import { CommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../auth/entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { id, updateUserDto } = command;

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    // If user is not found, throw a 404 exception
    if (!user) {
      throw new RpcException({
        error: 'Not Found',
        message: 'No User with this ID found',
        statusCode: 404,
      });
    }

    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
}
