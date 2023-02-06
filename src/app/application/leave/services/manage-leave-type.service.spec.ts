import { TestBed } from '@angular/core/testing';

import { ManageLeaveTypeService } from './manage-leave-type.service';

describe('ManageLeaveTypeService', () => {
  let service: ManageLeaveTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageLeaveTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
