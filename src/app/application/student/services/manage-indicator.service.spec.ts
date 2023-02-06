import { TestBed } from '@angular/core/testing';

import { ManageIndicatorService } from './manage-indicator.service';

describe('ManageIndicatorService', () => {
  let service: ManageIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
