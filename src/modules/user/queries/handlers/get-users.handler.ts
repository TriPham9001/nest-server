import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoggerService } from '../../../../shared/services/logger.service';
import { UserEntity } from '../../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersQuery } from '../get-users.query';
import { UserDto } from '../../dtos/user.dto';
import { PageDto } from 'src/common/dto/page.dto';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly _logger: LoggerService,
  ) {}

  async execute({
    findData,
    isPaging,
    dto,
  }: GetUsersQuery): Promise<UserEntity[] | PageDto<UserDto>> {
    this._logger.log('[query] Async GetUsersQuery...');

    if (isPaging) {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      const qB = queryBuilder.where(findData.where);

      //check exist findData relations and convert findData relations to array
      if (findData.relations) {
        const relations = Object.values(findData.relations);

        if (relations) {
          relations.forEach((relation) => {
            qB.leftJoinAndSelect(`user.${relation}`, relation);
          });
        }
      }

      const [items, pageMetaDto] = await qB.paginate(dto);

      return items.toPageDto(pageMetaDto);
    }
    return this.userRepository.find(findData);
  }
}
