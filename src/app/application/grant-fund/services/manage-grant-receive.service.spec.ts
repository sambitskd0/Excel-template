import { TestBed } from '@angular/core/testing';

import { ManageGrantReceiveService } from './manage-grant-receive.service';

describe('ManageGrantReceiveService', () => {
  let service: ManageGrantReceiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageGrantReceiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
