import { LoginUserDto } from './../../dto';

export class LoginUserCommand {
  constructor(public readonly loginUserDto: LoginUserDto) {}
}
