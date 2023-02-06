import { TestBed } from '@angular/core/testing';

import { SubjectMasterService } from './subject-master.service';

describe('SubjectMasterService', () => {
  let service: SubjectMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
