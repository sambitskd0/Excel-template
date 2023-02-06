import { TestBed } from '@angular/core/testing';

import { ManageGrantInfoService } from './manage-grant-info.service';

describe('ManageGrantInfoService', () => {
  let service: ManageGrantInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageGrantInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
