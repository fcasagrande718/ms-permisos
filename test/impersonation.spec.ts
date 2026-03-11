import { AuthorizeService } from '../src/authz/authorize.service';

describe('Impersonation', () => {
  it('considers impersonator extra allow', async () => {
    let calls = 0;
    const service = new AuthorizeService(
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ getOne: async () => (++calls === 2 ? { id: '1' } : null) }) }) }) }) }) }) }) }) } as any,
      { getOrBuildContext: jest.fn().mockResolvedValue({ perfil_usuario: 'usuario', keys_flat: [], keys_global: [], keys_por_sociedad: {} }) } as any,
    );
    const res = await service.authorize({ uuidEffective: 108387, uuidImpersonator: 900001, isImpersonated: true, key: 'faena.ver', resourceType: 'faena', resourceId: 99 });
    expect(res.allow).toBe(true);
  });
});
