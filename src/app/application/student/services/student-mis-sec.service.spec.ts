import { TestBed } from '@angular/core/testing';

import { StudentMisSecService } from './student-mis-sec.service';

describe('StudentMisSecService', () => {
  let service: StudentMisSecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentMisSecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
