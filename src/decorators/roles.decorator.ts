import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/constants/user.constant';

export const Roles = Reflector.createDecorator<UserRole[]>();
