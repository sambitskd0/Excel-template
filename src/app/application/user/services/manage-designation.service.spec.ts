import { TestBed } from '@angular/core/testing';

import { ManageDesignationService } from './manage-designation.service';

describe('ManageDesignationService', () => {
  let service: ManageDesignationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDesignationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
