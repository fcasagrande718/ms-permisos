import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PermissionByLevelEntity } from 'src/authz/entities/permission-by-level.entity';
import { FeatureFlagEntity } from 'src/authz/entities/feature-flag.entity';
import { UserFeatureFlagEntity } from 'src/authz/entities/user-feature-flag.entity';
import { AuthzOverrideEntity } from 'src/authz/entities/authz-override.entity';
import { DerivedFlagRuleEntity } from 'src/authz/entities/derived-flag-rule.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
  username: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'root',
  database: process.env.MYSQL_DATABASE ?? 'ms_permisos',
  entities: [
    PermissionByLevelEntity,
    FeatureFlagEntity,
    UserFeatureFlagEntity,
    AuthzOverrideEntity,
    DerivedFlagRuleEntity,
  ],
  migrations: ['src/database/migrations/*.ts'],
});
