import { Test, TestingModule } from '@nestjs/testing';
import { SellerOrdersService } from './seller-orders.service.js';

describe('SellerOrdersService', () => {
  let service: SellerOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerOrdersService],
    }).compile();

    service = module.get<SellerOrdersService>(SellerOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
