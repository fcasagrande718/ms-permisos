import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1710000000000 implements MigrationInterface {
  name = 'InitTables1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE permission_by_level (
        id BIGINT NOT NULL AUTO_INCREMENT,
        nivel_id INT NOT NULL,
        perm_key VARCHAR(200) NOT NULL,
        description VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_permission_level (nivel_id, perm_key),
        INDEX idx_perm_key (perm_key),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE feature_flag (
        id BIGINT NOT NULL AUTO_INCREMENT,
        flag_key VARCHAR(120) NOT NULL UNIQUE,
        enabled BOOLEAN NOT NULL DEFAULT false,
        description VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE user_feature_flag (
        id BIGINT NOT NULL AUTO_INCREMENT,
        uuid BIGINT NOT NULL,
        flag_key VARCHAR(120) NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT true,
        expires_at DATETIME NULL,
        reason VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_flag (uuid, flag_key),
        INDEX idx_user_flag_key (flag_key),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE authz_override (
        id BIGINT NOT NULL AUTO_INCREMENT,
        subject_type ENUM('all','user','global_role') NOT NULL,
        subject_id VARCHAR(64) NULL,
        effect ENUM('allow','deny') NOT NULL,
        \`key\` VARCHAR(200) NOT NULL,
        scope ENUM('global','sociedad','resource') NOT NULL,
        sociedad_id BIGINT NULL,
        resource_type VARCHAR(50) NULL,
        resource_id BIGINT NULL,
        expires_at DATETIME NULL,
        reason VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_subject (subject_type, subject_id),
        INDEX idx_key_scope (\`key\`, scope),
        INDEX idx_sociedad_id (sociedad_id),
        INDEX idx_resource (resource_type, resource_id),
        INDEX idx_effect (effect),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE derived_flag_rule (
        id BIGINT NOT NULL AUTO_INCREMENT,
        flag_key VARCHAR(120) NOT NULL,
        scope ENUM('global','sociedad') NOT NULL,
        conditions_json JSON NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT true,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_derived_flag_key (flag_key),
        INDEX idx_derived_enabled (enabled),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS derived_flag_rule');
    await queryRunner.query('DROP TABLE IF EXISTS authz_override');
    await queryRunner.query('DROP TABLE IF EXISTS user_feature_flag');
    await queryRunner.query('DROP TABLE IF EXISTS feature_flag');
    await queryRunner.query('DROP TABLE IF EXISTS permission_by_level');
  }
}
