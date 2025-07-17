import { Test, TestingModule } from '@nestjs/testing';
import { DnsZoneController } from './dns-zone.controller';

describe('DnsZoneController', () => {
  let controller: DnsZoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DnsZoneController],
    }).compile();

    controller = module.get<DnsZoneController>(DnsZoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
