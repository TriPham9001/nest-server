import { Controller, Get, HttpCode, HttpStatus, Version } from '@nestjs/common';
import { RoleService } from './role.service';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { RoleEntity } from './role.entity';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Version('1')
  @Get()
  @ResponseMessage('Roles successfully fetched')
  @HttpCode(HttpStatus.OK)
  async get(): Promise<RoleEntity[]> {
    return this.roleService.find();
  }
}
