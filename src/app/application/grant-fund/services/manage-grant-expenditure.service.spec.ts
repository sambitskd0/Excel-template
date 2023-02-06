import { TestBed } from '@angular/core/testing';

import { ManageGrantExpenditureService } from './manage-grant-expenditure.service';

describe('ManageGrantExpenditureService', () => {
  let service: ManageGrantExpenditureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageGrantExpenditureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
