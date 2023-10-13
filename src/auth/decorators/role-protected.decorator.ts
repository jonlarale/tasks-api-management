import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata('roles', args);
};
