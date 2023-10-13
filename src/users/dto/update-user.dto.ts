import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

class UserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstSurname: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  lastSurname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}
