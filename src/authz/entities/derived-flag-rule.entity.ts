import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('derived_flag_rule')
@Index(['flagKey'])
@Index(['enabled'])
export class DerivedFlagRuleEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'flag_key', type: 'varchar', length: 120 })
  flagKey!: string;

  @Column({ type: 'enum', enum: ['global', 'sociedad'] })
  scope!: 'global' | 'sociedad';

  @Column({ name: 'conditions_json', type: 'json' })
  conditionsJson!: {
    user?: { telefono_validado?: boolean; mail_validado?: boolean };
    sociedad?: { nivel_in?: number[] };
  };

  @Column({ type: 'boolean', default: true })
  enabled!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
