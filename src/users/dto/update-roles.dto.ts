import { IsArray, IsIn, ArrayNotEmpty } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

export class UpdateRolesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsIn([ValidRoles.ADMIN, ValidRoles.USER], { each: true })
  roles: ValidRoles[];
}
