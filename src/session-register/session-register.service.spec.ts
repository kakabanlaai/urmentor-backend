import { Test, TestingModule } from '@nestjs/testing';
import { SessionRegisterService } from './session-register.service';

describe('SessionRegisterService', () => {
  let service: SessionRegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionRegisterService],
    }).compile();

    service = module.get<SessionRegisterService>(SessionRegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
