import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type SubjectType = 'all' | 'user' | 'global_role';
export type EffectType = 'allow' | 'deny';
export type ScopeType = 'global' | 'sociedad' | 'resource';

@Entity('authz_override')
@Index(['subjectType', 'subjectId'])
@Index(['key', 'scope'])
@Index(['sociedadId'])
@Index(['resourceType', 'resourceId'])
@Index(['effect'])
export class AuthzOverrideEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'subject_type', type: 'enum', enum: ['all', 'user', 'global_role'] })
  subjectType!: SubjectType;

  @Column({ name: 'subject_id', type: 'varchar', length: 64, nullable: true })
  subjectId!: string | null;

  @Column({ type: 'enum', enum: ['allow', 'deny'] })
  effect!: EffectType;

  @Column({ type: 'varchar', length: 200 })
  key!: string;

  @Column({ type: 'enum', enum: ['global', 'sociedad', 'resource'] })
  scope!: ScopeType;

  @Column({ name: 'sociedad_id', type: 'bigint', nullable: true })
  sociedadId!: string | null;

  @Column({ name: 'resource_type', type: 'varchar', length: 50, nullable: true })
  resourceType!: string | null;

  @Column({ name: 'resource_id', type: 'bigint', nullable: true })
  resourceId!: string | null;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
