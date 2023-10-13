import { IsArray, IsIn, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

export class UpdateRolesDto {
  @ApiProperty({
    description: 'An array of roles to update for the user',
    required: true,
    type: [String],
    enum: [ValidRoles.ADMIN, ValidRoles.USER],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn([ValidRoles.ADMIN, ValidRoles.USER], { each: true })
  roles: ValidRoles[];
}
