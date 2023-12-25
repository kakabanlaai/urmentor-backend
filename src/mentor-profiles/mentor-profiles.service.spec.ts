import { Test, TestingModule } from '@nestjs/testing';
import { MentorProfilesService } from './mentor-profiles.service';

describe('MentorProfilesService', () => {
  let service: MentorProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentorProfilesService],
    }).compile();

    service = module.get<MentorProfilesService>(MentorProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
