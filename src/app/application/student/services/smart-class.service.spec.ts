import { TestBed } from '@angular/core/testing';

import { SmartClassService } from './smart-class.service';

describe('SmartClassService', () => {
  let service: SmartClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
