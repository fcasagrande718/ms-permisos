import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('user_feature_flag')
@Unique(['uuid', 'flagKey'])
export class UserFeatureFlagEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint' })
  uuid!: string;

  @Index()
  @Column({ name: 'flag_key', type: 'varchar', length: 120 })
  flagKey!: string;

  @Column({ type: 'boolean', default: true })
  enabled!: boolean;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
