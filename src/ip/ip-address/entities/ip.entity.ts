import { Company } from 'src/company/entities/company.entity';
import { DnsZone } from 'src/dns/dns-zone/entities/dns-zone.entity';
import { Domain } from 'src/domain/entities/domain.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class IpAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'inet', unique: true })
  ip: string;

  @Column({ nullable: true })
  type: 'IPv4' | 'IPv6';

  @Column({ nullable: true })
  reverseDns: string;

  @ManyToMany(() => Domain, (domain) => domain.ips, { cascade: true })
  @JoinTable()
  domains: Domain[];

  @ManyToOne(() => DnsZone, (dnsZone) => dnsZone.ipAddresses, {
    nullable: true,
  })
  dnsZone: DnsZone;

  @ManyToOne(() => Company, (company) => company.ipAddresses, {
    nullable: true,
  })
  company: Company;

  @Column({ nullable: true })
  source: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
