import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DnsZone } from '../../dns-zone/entities/dns-zone.entity';
import { IpAddress } from 'src/ip/entities/ip.entity';

export enum DnsRecordType {
  A = 'A',
  AAAA = 'AAAA',
  CNAME = 'CNAME',
  MX = 'MX',
  TXT = 'TXT',
  NS = 'NS',
  SOA = 'SOA',
  SRV = 'SRV',
  PTR = 'PTR',
}

@Entity('dns_records')
@Index(['name', 'type', 'dnsZoneId'], { unique: true })
@Index(['dnsZoneId'])
@Index(['ipId'])
export class DnsRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DnsRecordType })
  type: DnsRecordType;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column({ type: 'int', nullable: true })
  ttl?: number;

  @Column({ type: 'int', nullable: true })
  priority?: number;

  @ManyToOne(() => DnsZone, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'dnsZoneId' })
  dnsZone: DnsZone;

  @Column({ type: 'uuid' })
  dnsZoneId: string;

  @ManyToOne(() => IpAddress, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'ipId' })
  ip?: IpAddress;

  @Column({ type: 'uuid', nullable: true })
  ipId?: string | null;
}
