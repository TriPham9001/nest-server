export class DeleteBlogCommand {
  constructor(public readonly ids: Uuid[]) {}
}
