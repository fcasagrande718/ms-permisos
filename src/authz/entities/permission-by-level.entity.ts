import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('permission_by_level')
@Unique(['nivelId', 'permKey'])
export class PermissionByLevelEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'nivel_id', type: 'int' })
  nivelId!: number;

  @Index()
  @Column({ name: 'perm_key', type: 'varchar', length: 200 })
  permKey!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
