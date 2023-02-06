import { TestBed } from '@angular/core/testing';

import { StudentInformationService } from './student-information.service';

describe('StudentInformationService', () => {
  let service: StudentInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

