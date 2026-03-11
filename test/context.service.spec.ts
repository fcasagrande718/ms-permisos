import { ContextService } from '../src/authz/context.service';

describe('ContextService', () => {
  it('builds context and applies kill switch deny', async () => {
    const service = new ContextService(
      { find: jest.fn().mockResolvedValue([{ permKey: 'operaciones.faena.ventas.publicadas' }, { permKey: 'pagos.acceder' }]) } as any,
      { find: jest.fn().mockResolvedValue([{ flagKey: 'feature_experimental3' }]) } as any,
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ andWhere: () => ({ getMany: async () => [] }) }) }) }) } as any,
      { find: jest.fn().mockResolvedValue([]) } as any,
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ andWhere: () => ({ orderBy: () => ({ getMany: async () => [{ key: 'pagos.acceder', scope: 'global', effect: 'deny' }] }) }) }) }) }) } as any,
      { get: jest.fn().mockResolvedValue(null), setWithTtl: jest.fn(), del: jest.fn() } as any,
      { get: jest.fn().mockReturnValue(3600) } as any,
      { getUserProfile: jest.fn().mockResolvedValue({ mail_validado: true, telefono_validado: false, terminos_condiciones_dcp: true, preguntas_frecuentes_dcp: false, perfil: 3 }) } as any,
      { getSociedadesByUser: jest.fn().mockResolvedValue([{ sociedad_id: 7806, nivel: 1, attrs: {} }]) } as any,
    );

    const ctx = await service.getOrBuildContext(108387);
    expect(ctx.keys_por_sociedad['7806']).toContain('operaciones.faena.ventas.publicadas');
    expect(ctx.keys_flat).not.toContain('pagos.acceder');
  });
});
