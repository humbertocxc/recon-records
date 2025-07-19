import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { DnsZone } from 'src/dns/dns-zone/entities/dns-zone.entity';
import { IpAddress } from 'src/ip/entities/ip.entity';

@Entity()
export class Domain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  value: string;

  @Column({ type: 'int', nullable: true })
  rank?: number;

  @ManyToOne(() => Company, (company) => company.domains, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'companyId' })
  company?: Company;

  @Column({ nullable: true })
  companyId: string | null;

  @Column({ default: false })
  isInScope?: boolean;

  @OneToOne(() => DnsZone, (zone) => zone.domain, { nullable: true })
  dnsZone?: DnsZone;

  @ManyToMany(() => IpAddress, (ip) => ip.domains)
  ips: IpAddress[];
}
