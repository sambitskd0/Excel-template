import { TestBed } from '@angular/core/testing';

import { TeacherDashboardMisService } from './teacher-dashboard-mis.service';

describe('TeacherDashboardMisService', () => {
  let service: TeacherDashboardMisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherDashboardMisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
