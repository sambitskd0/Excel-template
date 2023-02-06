import { TestBed } from '@angular/core/testing';

import { ManageUsermisService } from './manage-usermis.service';

describe('ManageUsermisService', () => {
  let service: ManageUsermisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageUsermisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
