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
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { UpdateRolesDto } from './dto/update-roles.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(ValidRoles.ADMIN)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(ValidRoles.ADMIN, ValidRoles.USER)
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    if (user.id !== id || ValidRoles.ADMIN in user.roles) {
      throw new UnauthorizedException(
        'You are not authorized to view this user',
      );
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.USER)
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
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Response() res: ExpressResponse,
  ) {
    await this.usersService.remove(id);
    res.status(204).send();
  }

  @Patch(':id/activate')
  @Auth(ValidRoles.ADMIN)
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('activated') activated: boolean,
  ) {
    return this.usersService.updateStatus(id, activated);
  }

  @Patch(':id/roles')
  @Auth(ValidRoles.ADMIN)
  updateRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolesDto: UpdateRolesDto,
  ) {
    return this.usersService.updateRoles(id, updateRolesDto);
  }
}
