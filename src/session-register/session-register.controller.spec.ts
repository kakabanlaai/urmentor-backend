import { Test, TestingModule } from '@nestjs/testing';
import { SessionRegisterController } from './session-register.controller';
import { SessionRegisterService } from './session-register.service';

describe('SessionRegisterController', () => {
  let controller: SessionRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionRegisterController],
      providers: [SessionRegisterService],
    }).compile();

    controller = module.get<SessionRegisterController>(SessionRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
