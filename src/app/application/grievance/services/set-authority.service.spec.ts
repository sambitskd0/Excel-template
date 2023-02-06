import { TestBed } from '@angular/core/testing';

import { SetAuthorityService } from './set-authority.service';

describe('SetAuthorityService', () => {
  let service: SetAuthorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetAuthorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
