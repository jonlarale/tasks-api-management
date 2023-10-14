// Nestjs
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

// Users
import { UpdateUserDto } from './dto/update-user.dto';

// Auth
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { GetUsersQuery, GetUserQuery } from './queries/impl/';

// Common
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ErrorResponseDto } from 'src/common/dtos/error-response.dto';
import {
  ActivateUserCommand,
  DeleteUserCommand,
  UpdateUserCommand,
  UpdateUserRolesCommand,
} from './commands/impl';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [User],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.queryBus.execute(new GetUsersQuery(paginationDto));
  }

  @Get(':id')
  @Auth(ValidRoles.ADMIN, ValidRoles.USER)
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    if (user.id !== id || ValidRoles.ADMIN in user.roles) {
      throw new UnauthorizedException(
        'You are not authorized to view this user',
      );
    }
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Patch(':id')
  @Auth(ValidRoles.USER)
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (user.id !== id) {
      throw new UnauthorizedException(
        'You are not authorized to update this user',
      );
    }
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Response() res: ExpressResponse,
  ) {
    await this.commandBus.execute(new DeleteUserCommand(id));
    res.status(204).send();
  }

  @Patch(':id/activate')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('activated') activated: boolean,
  ) {
    return this.commandBus.execute(new ActivateUserCommand(id, activated));
  }

  @Patch(':id/roles')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'User roles updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolesDto: UpdateRolesDto,
  ) {
    return this.commandBus.execute(
      new UpdateUserRolesCommand(id, updateRolesDto),
    );
  }
}
