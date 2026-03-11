import { AuthorizeService } from '../src/authz/authorize.service';

describe('Kill switch', () => {
  it('deny has precedence', async () => {
    const service = new AuthorizeService(
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ getOne: async () => ({ id: '99' }) }) }) }) }) }) }) }) }) } as any,
      { getOrBuildContext: jest.fn().mockResolvedValue({ perfil_usuario: 'usuario', keys_flat: ['pagos.acceder'], keys_global: [], keys_por_sociedad: {} }) } as any,
    );
    const res = await service.authorize({ uuidEffective: 1, isImpersonated: false, key: 'pagos.acceder' });
    expect(res.allow).toBe(false);
  });
});
