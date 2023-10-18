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
import { MessagePattern } from '@nestjs/microservices';

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
import { UserCmd } from './enums/user-cmd.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(UserCmd.GET_ALL)
  public findAll(@Query() paginationDto: PaginationDto) {
    return this.queryBus.execute(new GetUsersQuery(paginationDto));
  }

  @MessagePattern(UserCmd.GET_ONE)
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    if (user.id !== id || ValidRoles.ADMIN in user.roles) {
      throw new UnauthorizedException(
        'You are not authorized to view this user',
      );
    }
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @MessagePattern(UserCmd.UPDATE)
  public update(
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

  @MessagePattern(UserCmd.DELETE)
  public remove(@Param('id', ParseUUIDPipe) id: string) {
    this.commandBus.execute(new DeleteUserCommand(id));
  }

  @MessagePattern(UserCmd.ACTIVATE)
  public activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('activated') activated: boolean,
  ) {
    return this.commandBus.execute(new ActivateUserCommand(id, activated));
  }

  @MessagePattern(UserCmd.UPDATE_ROLES)
  public updateRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolesDto: UpdateRolesDto,
  ) {
    return this.commandBus.execute(
      new UpdateUserRolesCommand(id, updateRolesDto),
    );
  }
}
