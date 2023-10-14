import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import { User } from '../../entities/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand) {
    const { createUserDto } = command;
    try {
      const user = this.userRepository.create(createUserDto);
      user.activated = true;
      user.activatedAt = new Date();

      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('Email already exists');
    }

    throw new InternalServerErrorException();
  }
}
