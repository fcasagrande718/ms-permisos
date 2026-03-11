import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthzOverrideEntity } from './entities/authz-override.entity';
import { ContextService } from './context.service';

interface Input {
  uuidEffective: number;
  uuidImpersonator?: number | null;
  isImpersonated: boolean;
  key: string;
  sociedadId?: number;
  resourceType?: string;
  resourceId?: number;
  requireContext?: boolean;
}

@Injectable()
export class AuthorizeService {
  constructor(
    @InjectRepository(AuthzOverrideEntity)
    private readonly overrideRepo: Repository<AuthzOverrideEntity>,
    private readonly contextService: ContextService,
  ) {}

  async authorize(input: Input) {
    const context = input.requireContext === false ? null : await this.contextService.getOrBuildContext(input.uuidEffective);
    const role = context?.perfil_usuario ?? 'usuario';

    const deny = await this.findMatching(input, 'deny', role, false);
    if (deny) return { allow: false, matched: { source: 'override', effect: 'deny', rule_id: Number(deny.id) }, reason: null };

    const allow = await this.findMatching(input, 'allow', role, true);
    if (allow) return { allow: true, matched: { source: 'override', effect: 'allow', rule_id: Number(allow.id) }, reason: null };

    if (!context && input.requireContext === false) {
      return { allow: false, matched: null, reason: 'context_required' };
    }

    const allowedByContext = this.inContext(context!, input.key, input.sociedadId);
    return {
      allow: allowedByContext,
      matched: allowedByContext ? { source: 'context', effect: 'allow', rule_id: 0 } : null,
      reason: allowedByContext ? null : 'fail_closed',
    };
  }

  async grants(key: string, resourceType: string, uuid: number): Promise<number[]> {
    const rows = await this.overrideRepo
      .createQueryBuilder('ao')
      .where("ao.effect = 'allow'")
      .andWhere("ao.scope = 'resource'")
      .andWhere('ao.key = :key', { key })
      .andWhere('ao.resource_type = :resourceType', { resourceType })
      .andWhere("ao.subject_type = 'user'")
      .andWhere('ao.subject_id = :uuid', { uuid: String(uuid) })
      .andWhere('(ao.expires_at IS NULL OR ao.expires_at > NOW())')
      .getMany();
    return rows.map((r) => Number(r.resourceId)).sort((a, b) => a - b);
  }

  private inContext(context: any, key: string, sociedadId?: number): boolean {
    if (sociedadId) {
      const sid = String(sociedadId);
      return (context.keys_por_sociedad[sid] ?? []).includes(key) || context.keys_global.includes(key);
    }
    return context.keys_flat.includes(key);
  }

  private async findMatching(input: Input, effect: 'allow' | 'deny', role: string, includeImpersonator: boolean) {
    const qb = this.overrideRepo
      .createQueryBuilder('ao')
      .where('ao.effect = :effect', { effect })
      .andWhere('ao.key = :key', { key: input.key })
      .andWhere('(ao.expires_at IS NULL OR ao.expires_at > NOW())');

    if (input.resourceType && input.resourceId) {
      qb.andWhere("ao.scope = 'resource'")
        .andWhere('ao.resource_type = :resourceType', { resourceType: input.resourceType })
        .andWhere('ao.resource_id = :resourceId', { resourceId: input.resourceId });
    } else if (input.sociedadId) {
      qb.andWhere("(ao.scope = 'global' OR (ao.scope = 'sociedad' AND ao.sociedad_id = :sid))", {
        sid: input.sociedadId,
      });
    } else {
      qb.andWhere("ao.scope IN ('global','sociedad')");
    }

    const subjects = [
      "(ao.subject_type = 'all')",
      `(ao.subject_type = 'global_role' AND ao.subject_id = '${role}')`,
      `(ao.subject_type = 'user' AND ao.subject_id = '${input.uuidEffective}')`,
    ];
    if (includeImpersonator && input.isImpersonated && input.uuidImpersonator) {
      subjects.push(`(ao.subject_type = 'user' AND ao.subject_id = '${input.uuidImpersonator}')`);
    }
    qb.andWhere(`(${subjects.join(' OR ')})`);
    return qb.getOne();
  }
}
