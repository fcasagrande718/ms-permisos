import dataSource from '../data-source';

async function seed() {
  await dataSource.initialize();

  await dataSource.query(`INSERT IGNORE INTO permission_by_level (nivel_id, perm_key, description) VALUES
    (1, 'operaciones.faena.ventas.publicadas', 'Nivel 1'),
    (1, 'operaciones.faena.ventas.vendidas', 'Nivel 1'),
    (1, 'pagos.acceder', 'Nivel 1'),
    (2, 'operaciones.faena.ventas.vendidas', 'Nivel 2'),
    (3, 'operaciones.invernada.ventas.publicadas', 'Nivel 3')`);

  await dataSource.query(`INSERT IGNORE INTO feature_flag (flag_key, enabled, description) VALUES
    ('feature_experimental3', true, 'global')`);

  await dataSource.query(`INSERT IGNORE INTO user_feature_flag (uuid, flag_key, enabled) VALUES
    (200001, 'beta_usuario', true)`);

  await dataSource.query(`INSERT IGNORE INTO authz_override (subject_type, subject_id, effect, \`key\`, scope, reason) VALUES
    ('all', NULL, 'deny', 'pagos.acceder', 'global', 'kill switch')`);

  await dataSource.query(`INSERT IGNORE INTO authz_override (subject_type, subject_id, effect, \`key\`, scope, resource_type, resource_id, reason) VALUES
    ('user', '108387', 'allow', 'faena.ver', 'resource', 'faena', 15, 'grant resource'),
    ('user', '900001', 'allow', 'faena.ver', 'resource', 'faena', 99, 'allow impersonador')`);

  await dataSource.query(`INSERT IGNORE INTO derived_flag_rule (flag_key, scope, conditions_json, enabled) VALUES
    ('telefono_validado_n2', 'sociedad', JSON_OBJECT('user', JSON_OBJECT('telefono_validado', true), 'sociedad', JSON_OBJECT('nivel_in', JSON_ARRAY(2))), true)`);

  await dataSource.destroy();
}

seed();
