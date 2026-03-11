import { Body, Controller, Get, Headers, Post, Query, ValidationPipe } from '@nestjs/common';
import { AuthorizeQueryDto } from './dto/authorize-query.dto';
import { InvalidateContextDto } from './dto/invalidate-context.dto';
import { AuthorizeService } from './authorize.service';
import { ContextService } from './context.service';
import { InvalidateService } from './invalidate.service';

@Controller()
export class AuthzController {
  constructor(
    private readonly contextService: ContextService,
    private readonly authorizeService: AuthorizeService,
    private readonly invalidateService: InvalidateService,
  ) {}

  @Get('/context')
  async context(@Headers() headers: Record<string, string>) {
    const uuid = Number(headers.uuid);
    return this.contextService.getOrBuildContext(uuid);
  }

  @Get('/internal/authorize')
  async authorize(@Query(new ValidationPipe({ transform: true })) query: AuthorizeQueryDto, @Headers() headers: Record<string, string>) {
    const uuidEffective = Number(headers.uuid);
    const impersonate = String(headers['impersonate'] ?? '').toLowerCase() === 'true';
    const uuidImpersonator = headers['impersonator-uuid'] ? Number(headers['impersonator-uuid']) : null;

    return this.authorizeService.authorize({
      uuidEffective,
      uuidImpersonator,
      isImpersonated: impersonate && !!uuidImpersonator,
      key: query.key,
      sociedadId: query.sociedad_id ? Number(query.sociedad_id) : undefined,
      resourceType: query.resource_type,
      resourceId: query.resource_id ? Number(query.resource_id) : undefined,
      requireContext: query.require_context === undefined ? true : query.require_context === 'true',
    });
  }

  @Post('/internal/context/invalidate')
  async invalidate(
    @Body(new ValidationPipe({ transform: true })) body: InvalidateContextDto,
    @Headers() headers: Record<string, string>,
  ) {
    await this.invalidateService.invalidate(body.uuid);
    const impersonate = String(headers['impersonate'] ?? '').toLowerCase() === 'true';
    if (impersonate && headers.uuid) {
      await this.invalidateService.invalidate(Number(headers.uuid));
    }
    return { ok: true };
  }

  @Get('/internal/grants')
  async grants(@Query('key') key: string, @Query('resource_type') resourceType: string, @Query('uuid') uuid: string, @Headers() headers: Record<string, string>) {
    const id = uuid ? Number(uuid) : Number(headers.uuid);
    return { ids: await this.authorizeService.grants(key, resourceType, id) };
  }
}
