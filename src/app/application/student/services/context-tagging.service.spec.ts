import { TestBed } from '@angular/core/testing';

import { ContextTaggingService } from './context-tagging.service';

describe('ContextTaggingService', () => {
  let service: ContextTaggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextTaggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
