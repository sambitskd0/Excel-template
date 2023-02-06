import { TestBed } from '@angular/core/testing';

import { RaiseGrievanceService } from './raise-grievance.service';

describe('RaiseGrievanceService', () => {
  let service: RaiseGrievanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaiseGrievanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
