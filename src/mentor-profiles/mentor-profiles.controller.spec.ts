import { Test, TestingModule } from '@nestjs/testing';
import { MentorProfilesController } from './mentor-profiles.controller';
import { MentorProfilesService } from './mentor-profiles.service';

describe('MentorProfilesController', () => {
  let controller: MentorProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorProfilesController],
      providers: [MentorProfilesService],
    }).compile();

    controller = module.get<MentorProfilesController>(MentorProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
