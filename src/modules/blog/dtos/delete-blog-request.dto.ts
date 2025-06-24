import { IsArray } from 'class-validator';

export class DeleteBlogRequestDto {
  @IsArray()
  blogIds: Uuid[];

  constructor(partial: Partial<DeleteBlogRequestDto>) {
    Object.assign(this, partial);
  }
}
