import { Domain } from 'src/domain/entities/domain.entity';
import { IpAddress } from 'src/ip/entities/ip.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
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

  @Column({ nullable: true })
  createdAt?: Date;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'unknown';

  @ManyToMany(() => IpAddress, (ip) => ip.dnsZone)
  ips: IpAddress[];
}
