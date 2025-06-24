export class DeleteUserCommand {
  constructor(
    public readonly id: Uuid,
    public readonly hardDelete?: boolean,
  ) {}
}
