import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Domain } from '../../domain/entities/domain.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Domain, (domain) => domain.company, { cascade: true })
  domains: Domain[];
}
