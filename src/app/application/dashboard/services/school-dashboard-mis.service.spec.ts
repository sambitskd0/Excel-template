import { TestBed } from '@angular/core/testing';

import { SchoolDashboardMisService } from './school-dashboard-mis.service';

describe('SchoolDashboardMisService', () => {
  let service: SchoolDashboardMisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolDashboardMisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
