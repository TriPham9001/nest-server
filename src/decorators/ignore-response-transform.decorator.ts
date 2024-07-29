import { SetMetadata } from '@nestjs/common';

export const IgnoreResponseTransform = () =>
  SetMetadata('ignore_response_transform', true);
