import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionByLevelEntity } from 'src/authz/entities/permission-by-level.entity';
import { FeatureFlagEntity } from 'src/authz/entities/feature-flag.entity';
import { UserFeatureFlagEntity } from 'src/authz/entities/user-feature-flag.entity';
import { AuthzOverrideEntity } from 'src/authz/entities/authz-override.entity';
import { DerivedFlagRuleEntity } from 'src/authz/entities/derived-flag-rule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        entities: [
          PermissionByLevelEntity,
          FeatureFlagEntity,
          UserFeatureFlagEntity,
          AuthzOverrideEntity,
          DerivedFlagRuleEntity,
        ],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
