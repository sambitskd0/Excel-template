import { TestBed } from '@angular/core/testing';

import { SchoolService } from './school.service';

describe('SchoolseService', () => {
  let service: SchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
