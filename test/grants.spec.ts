import { AuthorizeService } from '../src/authz/authorize.service';

describe('Grants', () => {
  it('returns resource ids', async () => {
    const service = new AuthorizeService(
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ andWhere: () => ({ getMany: async () => [{ resourceId: '15' }, { resourceId: '22' }] }) }) }) }) }) }) }) }) } as any,
      {} as any,
    );
    await expect(service.grants('faena.ver', 'faena', 108387)).resolves.toEqual([15, 22]);
  });
});
