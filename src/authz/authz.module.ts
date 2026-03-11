import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthzController } from './authz.controller';
import { ContextService, SOCIEDADES_PROVIDER, USER_CLIENT } from './context.service';
import { AuthorizeService } from './authorize.service';
import { InvalidateService } from './invalidate.service';
import { PermissionByLevelEntity } from './entities/permission-by-level.entity';
import { FeatureFlagEntity } from './entities/feature-flag.entity';
import { UserFeatureFlagEntity } from './entities/user-feature-flag.entity';
import { AuthzOverrideEntity } from './entities/authz-override.entity';
import { DerivedFlagRuleEntity } from './entities/derived-flag-rule.entity';
import { UsersHttpClient } from './users/users-http.client';
import { UsersSociedadesMockProvider } from './users/users-sociedades.mock';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      PermissionByLevelEntity,
      FeatureFlagEntity,
      UserFeatureFlagEntity,
      AuthzOverrideEntity,
      DerivedFlagRuleEntity,
    ]),
  ],
  controllers: [AuthzController],
  providers: [
    ContextService,
    AuthorizeService,
    InvalidateService,
    { provide: USER_CLIENT, useClass: UsersHttpClient },
    { provide: SOCIEDADES_PROVIDER, useClass: UsersSociedadesMockProvider },
  ],
})
export class AuthzModule {}
