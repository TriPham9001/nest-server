import { CreateBlogHandler } from './create-blog.handler';
import { DeleteBlogHandler } from './delete-blog.handler';
import { UpdateBlogHandler } from './update-blog.handler';

export const CommandHandlers = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
];
