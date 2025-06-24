import { RoleEntity } from 'src/modules/role/role.entity';
import { DataSource, DeepPartial, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(RoleEntity);
    const roles: DeepPartial<RoleEntity>[] = [
      {
        name: 'Admin',
        description: 'Admin',
        slug: 'admin',
      },
      {
        name: 'User',
        description: 'User',
        slug: 'user',
      },
    ];

    const roleSlugs = roles.map((role) => role.slug);

    const roleEntities = await repository.find({
      where: {
        slug: In(roleSlugs),
      },
    });

    for (const role of roles) {
      if (!roleEntities.find((r) => r.slug === role.slug)) {
        await repository.save(role);
      }
    }
  }
}
