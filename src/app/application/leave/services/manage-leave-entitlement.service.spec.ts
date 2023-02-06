import { TestBed } from '@angular/core/testing';

import { ManageLeaveEntitlementService } from './manage-leave-entitlement.service';

describe('ManageLeaveEntitlementService', () => {
  let service: ManageLeaveEntitlementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageLeaveEntitlementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
