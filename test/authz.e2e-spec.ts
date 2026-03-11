import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthzController } from '../src/authz/authz.controller';
import { ContextService } from '../src/authz/context.service';
import { AuthorizeService } from '../src/authz/authorize.service';
import { InvalidateService } from '../src/authz/invalidate.service';

describe('AuthzController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthzController],
      providers: [
        {
          provide: ContextService,
          useValue: {
            getOrBuildContext: async () => ({
              user_id: 108387,
              perfil_usuario: 'usuario',
              user_attrs: {
                mail_validado: true,
                telefono_validado: false,
                terminos_condiciones_dcp: true,
                preguntas_frecuentes_dcp: false,
              },
              sociedades: [{ sociedad_id: 7806, nivel: 1, attrs: {} }],
              keys_por_sociedad: {
                '7806': ['operaciones.faena.ventas.publicadas'],
              },
              keys_global: ['ff.feature_experimental3'],
              keys_flat: ['operaciones.faena.ventas.publicadas', 'ff.feature_experimental3'],
              ttl_seconds: 3600,
            }),
            invalidate: async () => undefined,
          },
        },
        {
          provide: AuthorizeService,
          useValue: {
            authorize: async () => ({ allow: false, matched: null, reason: 'context_required' }),
            grants: async () => [15],
          },
        },
        { provide: InvalidateService, useValue: { invalidate: async () => undefined } },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/context returns sociedad_id and keys', async () => {
    const res = await request(app.getHttpServer())
      .get('/context')
      .set('Uuid', '108387')
      .set('User-Profile', '3');

    expect(res.body.user_id).toBe(108387);
    expect(res.body.keys_por_sociedad['7806']).toContain('operaciones.faena.ventas.publicadas');
  });
});
