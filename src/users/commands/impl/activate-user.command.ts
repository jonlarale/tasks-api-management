export class ActivateUserCommand {
  constructor(
    public readonly id: string,
    public readonly status: boolean,
  ) {}
}
