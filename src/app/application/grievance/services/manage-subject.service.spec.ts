import { TestBed } from '@angular/core/testing';

import { ManageSubjectService } from './manage-subject.service';

describe('ManageSubjectService', () => {
  let service: ManageSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
