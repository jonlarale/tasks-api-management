import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    minLength: 3,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'The first surname of the user',
    minLength: 3,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstSurname: string;

  @ApiProperty({
    description: 'The last surname of the user (optional)',
    minLength: 3,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  lastSurname: string;

  @ApiProperty({
    description: 'The email address of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user (strong password)',
    required: true,
  })
  @IsStrongPassword()
  password?: string;
}
