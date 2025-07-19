import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Domain } from '../../domain/entities/domain.entity';
import { IpAddress } from 'src/ip/entities/ip.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  scope?: string[];

  @OneToMany(() => Domain, (domain) => domain.company, { cascade: true })
  domains: Domain[];

  @ManyToMany(() => IpAddress, (ip) => ip.company)
  ips: IpAddress[];
}
