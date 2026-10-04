import { Test, TestingModule } from '@nestjs/testing';
import { SellerOrdersController } from './seller-orders.controller.js';

describe('SellerOrdersController', () => {
  let controller: SellerOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerOrdersController],
    }).compile();

    controller = module.get<SellerOrdersController>(SellerOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
