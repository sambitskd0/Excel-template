import { TestBed } from '@angular/core/testing';

import { TeacherPromotionService } from './teacher-promotion.service';

describe('TeacherPromotionService', () => {
  let service: TeacherPromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherPromotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
