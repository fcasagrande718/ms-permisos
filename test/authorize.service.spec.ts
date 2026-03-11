import { AuthorizeService } from '../src/authz/authorize.service';

describe('AuthorizeService', () => {
  it('fail-closed when require_context=false and no direct rule', async () => {
    const service = new AuthorizeService(
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ getOne: async () => null }) }) }) }) }) }) }) }) } as any,
      { getOrBuildContext: jest.fn() } as any,
    );
    const res = await service.authorize({ uuidEffective: 1, isImpersonated: false, key: 'x', requireContext: false });
    expect(res.allow).toBe(false);
    expect(res.reason).toBe('context_required');
  });
});
