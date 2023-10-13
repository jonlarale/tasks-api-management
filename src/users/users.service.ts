import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {}

  findAll(paginationDto: PaginationDto) {
    const {
      limit = this.configService.get('paginationLimit'),
      offset = this.configService.get('paginationOffset'),
    } = paginationDto;
    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    // If user is not found, throw a 404 exception
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateStatus(id: string, status: boolean) {
    const user = await this.findOne(id);
    user.activated = status;
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async updateRoles(id: string, updateRolesDto: UpdateRolesDto) {
    const user = await this.findOne(id);
    user.roles = updateRolesDto.roles;
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
}
