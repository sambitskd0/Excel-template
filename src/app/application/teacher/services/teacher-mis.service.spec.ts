import { TestBed } from '@angular/core/testing';

import { TeacherMisService } from './teacher-mis.service';

describe('TeacherMisService', () => {
  let service: TeacherMisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherMisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
