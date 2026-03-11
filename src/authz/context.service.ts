import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContextResponseDto } from './dto/context-response.dto';
import { PermissionByLevelEntity } from './entities/permission-by-level.entity';
import { FeatureFlagEntity } from './entities/feature-flag.entity';
import { UserFeatureFlagEntity } from './entities/user-feature-flag.entity';
import { DerivedFlagRuleEntity } from './entities/derived-flag-rule.entity';
import { AuthzOverrideEntity } from './entities/authz-override.entity';
import { RedisService } from 'src/redis/redis.service';
import { UsersClientInterface, UsersSociedadesProvider } from './users/users-client.interface';

const USER_CLIENT = 'USERS_CLIENT';
const SOCIEDADES_PROVIDER = 'USERS_SOCIEDADES_PROVIDER';

@Injectable()
export class ContextService {
  constructor(
    @InjectRepository(PermissionByLevelEntity)
    private readonly permissionRepo: Repository<PermissionByLevelEntity>,
    @InjectRepository(FeatureFlagEntity)
    private readonly featureFlagRepo: Repository<FeatureFlagEntity>,
    @InjectRepository(UserFeatureFlagEntity)
    private readonly userFeatureFlagRepo: Repository<UserFeatureFlagEntity>,
    @InjectRepository(DerivedFlagRuleEntity)
    private readonly derivedRuleRepo: Repository<DerivedFlagRuleEntity>,
    @InjectRepository(AuthzOverrideEntity)
    private readonly overrideRepo: Repository<AuthzOverrideEntity>,
    private readonly redisService: RedisService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(USER_CLIENT) private readonly usersClient: UsersClientInterface,
    @Inject(SOCIEDADES_PROVIDER)
    private readonly usersSociedadesProvider: UsersSociedadesProvider,
  ) {}

  async getOrBuildContext(uuidEffective: number): Promise<ContextResponseDto> {
    const cacheKey = `context:${uuidEffective}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached) as ContextResponseDto;

    const context = await this.buildContext(uuidEffective);
    await this.redisService.setWithTtl(
      cacheKey,
      JSON.stringify(context),
      this.configService.get<number>('contextTtlSeconds', 3600),
    );
    return context;
  }

  async invalidate(uuid: number): Promise<void> {
    await this.redisService.del(`context:${uuid}`);
  }

  async buildContext(uuidEffective: number): Promise<ContextResponseDto> {
    const user = await this.usersClient.getUserProfile(uuidEffective);
    const sociedades = await this.usersSociedadesProvider.getSociedadesByUser(uuidEffective);

    const keysPorSociedad: Record<string, Set<string>> = {};
    const keysGlobal = new Set<string>();

    for (const sociedad of sociedades) {
      const perms = await this.permissionRepo.find({ where: { nivelId: sociedad.nivel } });
      keysPorSociedad[String(sociedad.sociedad_id)] = new Set(perms.map((p) => p.permKey));
    }

    const globalFlags = await this.featureFlagRepo.find({ where: { enabled: true } });
    globalFlags.forEach((f) => keysGlobal.add(`ff.${f.flagKey}`));

    const userFlags = await this.userFeatureFlagRepo
      .createQueryBuilder('uff')
      .where('uff.uuid = :uuid', { uuid: uuidEffective })
      .andWhere('uff.enabled = true')
      .andWhere('(uff.expires_at IS NULL OR uff.expires_at > NOW())')
      .getMany();
    userFlags.forEach((f) => keysGlobal.add(`ff.${f.flagKey}`));

    const derived = await this.derivedRuleRepo.find({ where: { enabled: true } });
    for (const rule of derived) {
      for (const sociedad of sociedades) {
        const okUserTel =
          rule.conditionsJson.user?.telefono_validado === undefined ||
          rule.conditionsJson.user.telefono_validado === user.telefono_validado;
        const okUserMail =
          rule.conditionsJson.user?.mail_validado === undefined ||
          rule.conditionsJson.user.mail_validado === user.mail_validado;
        const okNivel =
          !rule.conditionsJson.sociedad?.nivel_in ||
          rule.conditionsJson.sociedad.nivel_in.includes(sociedad.nivel);
        if (okUserTel && okUserMail && okNivel) {
          const flag = `ff.${rule.flagKey}`;
          if (rule.scope === 'global') keysGlobal.add(flag);
          if (rule.scope === 'sociedad') {
            keysPorSociedad[String(sociedad.sociedad_id)] ||= new Set<string>();
            keysPorSociedad[String(sociedad.sociedad_id)].add(flag);
          }
        }
      }
    }

    const role = this.toPerfil(user.perfil);
    const overrides = await this.overrideRepo
      .createQueryBuilder('ao')
      .where('(ao.expires_at IS NULL OR ao.expires_at > NOW())')
      .andWhere('ao.scope IN (:...scopes)', { scopes: ['global', 'sociedad'] })
      .andWhere(
        "(ao.subject_type = 'all' OR (ao.subject_type = 'global_role' AND ao.subject_id = :role) OR (ao.subject_type = 'user' AND ao.subject_id = :uuid))",
        { role, uuid: String(uuidEffective) },
      )
      .orderBy("FIELD(ao.effect, 'deny','allow')", 'ASC')
      .getMany();

    for (const ov of overrides) {
      const key = ov.key;
      if (ov.scope === 'global') {
        this.applySetEffect(keysGlobal, key, ov.effect);
        Object.values(keysPorSociedad).forEach((bucket) => this.applySetEffect(bucket, key, ov.effect));
      }
      if (ov.scope === 'sociedad' && ov.sociedadId) {
        const sid = String(ov.sociedadId);
        keysPorSociedad[sid] ||= new Set<string>();
        this.applySetEffect(keysPorSociedad[sid], key, ov.effect);
      }
    }

    const keysFlat = new Set<string>([...keysGlobal]);
    Object.values(keysPorSociedad).forEach((bucket) => bucket.forEach((k) => keysFlat.add(k)));

    return {
      user_id: uuidEffective,
      perfil_usuario: role,
      user_attrs: {
        mail_validado: user.mail_validado,
        telefono_validado: user.telefono_validado,
        terminos_condiciones_dcp: user.terminos_condiciones_dcp,
        preguntas_frecuentes_dcp: user.preguntas_frecuentes_dcp,
      },
      sociedades,
      keys_por_sociedad: Object.fromEntries(
        Object.entries(keysPorSociedad).map(([k, v]) => [k, [...v].sort()]),
      ),
      keys_global: [...keysGlobal].sort(),
      keys_flat: [...keysFlat].sort(),
      ttl_seconds: this.configService.get<number>('contextTtlSeconds', 3600),
    };
  }

  private applySetEffect(bucket: Set<string>, key: string, effect: 'allow' | 'deny') {
    if (effect === 'deny') bucket.delete(key);
    else bucket.add(key);
  }

  toPerfil(perfil: number): string {
    if (perfil === 1) return 'administrador';
    if (perfil === 2) return 'representante';
    return 'usuario';
  }
}

export { USER_CLIENT, SOCIEDADES_PROVIDER };
