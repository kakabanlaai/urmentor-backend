import { Test, TestingModule } from '@nestjs/testing';
import { MentorApplicationsController } from './mentor-applications.controller';
import { MentorApplicationsService } from './mentor-applications.service';

describe('MentorApplicationsController', () => {
  let controller: MentorApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorApplicationsController],
      providers: [MentorApplicationsService],
    }).compile();

    controller = module.get<MentorApplicationsController>(MentorApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
