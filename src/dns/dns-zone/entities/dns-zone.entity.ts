import { DnsRecord } from 'src/dns/dns-record/entities/dns-record.entity';
import { Domain } from 'src/domain/entities/domain.entity';
import { IpAddress } from 'src/ip/entities/ip.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DnsZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Domain, (domain) => domain.dnsZone, { onDelete: 'CASCADE' })
  @JoinColumn()
  domain: Domain;

  @Column('simple-array', { nullable: true })
  nameservers: string[];

  @Column({ nullable: true })
  soaRecord: string;

  @Column({ nullable: true })
  whoisRegistrar: string;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'unknown';

  @ManyToMany(() => IpAddress, (ip) => ip.dnsZone)
  ips: IpAddress[];

  @OneToMany(() => DnsRecord, (dnsRecord) => dnsRecord.dnsZone)
  dnsRecords: DnsRecord[];
}
