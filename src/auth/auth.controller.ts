// Nestjs
import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

// Auth
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';

// Common
import { ErrorResponseDto } from 'src/common/dtos/error-response.dto';
import { CreateUserCommand, LoginUserCommand } from './commands/impl';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  create(@Body() createAuthDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createAuthDto));
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.commandBus.execute(new LoginUserCommand(loginUserDto));
  }
}
