import { TestBed } from '@angular/core/testing';

import { LogInUserProfileService } from './log-in-user-profile.service';

describe('LogInUserProfileService', () => {
  let service: LogInUserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogInUserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
