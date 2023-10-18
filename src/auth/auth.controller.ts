// Nestjs
import { Controller, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '@nestjs/microservices';
import { UnauthorizedException } from '@nestjs/common';

// Auth
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { AuthCmd } from './enums/auth-cmd.enum';

// Common
import { CreateUserCommand, LoginUserCommand } from './commands/impl';
import { GetUserQuery } from './queries/impl/';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  @MessagePattern(AuthCmd.SIGN_UP)
  public create(@Body() createAuthDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createAuthDto));
  }

  @MessagePattern(AuthCmd.LOGIN)
  public loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.commandBus.execute(new LoginUserCommand(loginUserDto));
  }

  @MessagePattern(AuthCmd.AUTH_VERIFY)
  public async verifyToken(
    @Payload() payload: { accessToken: string },
  ): Promise<User | null> {
    try {
      const { accessToken } = payload;
      const decodedToken = this.jwtService.verify(accessToken);
      const userId = decodedToken.id;
      const user = await this.queryBus.execute(new GetUserQuery(userId));

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
