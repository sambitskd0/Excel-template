import { TestBed } from '@angular/core/testing';

import { ManageExpenditureTypeService } from './manage-expenditure-type.service';

describe('ManageExpenditureTypeService', () => {
  let service: ManageExpenditureTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageExpenditureTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
