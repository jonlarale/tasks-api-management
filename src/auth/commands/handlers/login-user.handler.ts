import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../../entities/user.entity';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginUserCommand) {
    const { loginUserDto } = command;
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id'],
    });

    if (!user) {
      throw new RpcException({
        error: 'Unauthorized',
        message: 'Credentials are invalid (email)',
        statusCode: 401,
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new RpcException({
        error: 'Unauthorized',
        message: 'Credentials are invalid (password)',
        statusCode: 401,
      });
    }
    delete user.email;
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
