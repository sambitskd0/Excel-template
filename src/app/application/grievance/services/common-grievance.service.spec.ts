import { TestBed } from '@angular/core/testing';

import { CommonGrievanceService } from './common-grievance.service';

describe('CommonGrievanceService', () => {
  let service: CommonGrievanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonGrievanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
