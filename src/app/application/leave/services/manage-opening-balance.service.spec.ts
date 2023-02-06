import { TestBed } from '@angular/core/testing';

import { ManageOpeningBalanceService } from './manage-opening-balance.service';

describe('ManageOpeningBalanceService', () => {
  let service: ManageOpeningBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageOpeningBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
