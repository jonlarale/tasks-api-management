import { UpdateRolesDto } from '../../dto/update-roles.dto';

export class UpdateUserRolesCommand {
  constructor(
    public readonly id: string,
    public readonly updateRolesDto: UpdateRolesDto,
  ) {}
}
