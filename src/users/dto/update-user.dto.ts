import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UserDto {
  @ApiProperty({
    description: 'The name of the user',
    required: true,
    type: String,
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'The first surname of the user',
    required: true,
    type: String,
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstSurname: string;

  @ApiProperty({
    description: 'The last surname of the user',
    required: false,
    type: String,
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  lastSurname: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
    type: String,
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}
