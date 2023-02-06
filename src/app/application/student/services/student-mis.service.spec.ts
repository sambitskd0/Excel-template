import { TestBed } from '@angular/core/testing';

import { StudentMisService } from './student-mis.service';

describe('StudentMisService', () => {
  let service: StudentMisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentMisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
