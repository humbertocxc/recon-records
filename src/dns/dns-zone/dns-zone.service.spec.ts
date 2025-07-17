import { Test, TestingModule } from '@nestjs/testing';
import { DnsZoneService } from './dns-zone.service';

describe('DnsZoneService', () => {
  let service: DnsZoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DnsZoneService],
    }).compile();

    service = module.get<DnsZoneService>(DnsZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
