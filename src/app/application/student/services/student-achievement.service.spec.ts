import { TestBed } from '@angular/core/testing';

import { StudentAchievementService } from './student-achievement.service';

describe('StudentAchievementService', () => {
  let service: StudentAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
