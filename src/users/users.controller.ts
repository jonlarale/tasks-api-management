// Nestjs
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, RpcException } from '@nestjs/microservices';

// Users
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ActivateUserCommand,
  DeleteUserCommand,
  UpdateUserCommand,
  UpdateUserRolesCommand,
} from './commands/impl';
import { UserCmd } from './enums/user-cmd.enum';

// Auth
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { GetUsersQuery, GetUserQuery } from './queries/impl/';

// Common
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(UserCmd.GET_ALL)
  public findAll(data: { paginationDto: PaginationDto }) {
    const { paginationDto } = data;
    return this.queryBus.execute(new GetUsersQuery(paginationDto));
  }

  @MessagePattern(UserCmd.GET_ONE)
  public findOne(data: { id: string }, @GetUser() user: User) {
    const { id } = data;
    if (user.id !== id || ValidRoles.ADMIN in user.roles) {
      throw new RpcException({
        error: 'Unauthorized',
        message: 'You are not authorized to get this user',
        statusCode: 401,
      });
    }
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @MessagePattern(UserCmd.UPDATE)
  public update(
    data: { id: string; updateUserDto: UpdateUserDto },
    @GetUser() user: User,
  ) {
    const { id, updateUserDto } = data;
    if (user.id !== id) {
      throw new RpcException({
        error: 'Unauthorized',
        message: 'You are not authorized to get this user',
        statusCode: 401,
      });
    }
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @MessagePattern(UserCmd.DELETE)
  public remove(data: { id: string }) {
    const { id } = data;
    this.commandBus.execute(new DeleteUserCommand(id));
  }

  @MessagePattern(UserCmd.ACTIVATE)
  public activate(data: { id: string; activated: boolean }) {
    const { id, activated } = data;
    return this.commandBus.execute(new ActivateUserCommand(id, activated));
  }

  @MessagePattern(UserCmd.UPDATE_ROLES)
  public updateRoles(data: { id: string; updateRolesDto: UpdateRolesDto }) {
    const { id, updateRolesDto } = data;
    return this.commandBus.execute(
      new UpdateUserRolesCommand(id, updateRolesDto),
    );
  }
}
