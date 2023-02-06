import { TestBed } from '@angular/core/testing';

import { ContextMasterService } from './context-master.service';

describe('ContextMasterService', () => {
  let service: ContextMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
