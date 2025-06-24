import { CreateBlogRequestDto } from '../dtos/create-blog-request.dto';

export class CreateBlogCommand {
  constructor(public readonly createBlogRequestDto: CreateBlogRequestDto) {}
}
