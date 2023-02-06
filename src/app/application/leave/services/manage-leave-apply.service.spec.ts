import { TestBed } from '@angular/core/testing';

import { ManageLeaveApplyService } from './manage-leave-apply.service';

describe('ManageLeaveApplyService', () => {
  let service: ManageLeaveApplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageLeaveApplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
