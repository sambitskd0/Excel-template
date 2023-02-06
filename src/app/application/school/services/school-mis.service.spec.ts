import { TestBed } from '@angular/core/testing';

import { SchoolMisService } from './school-mis.service';

describe('SchoolMisService', () => {
  let service: SchoolMisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolMisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
