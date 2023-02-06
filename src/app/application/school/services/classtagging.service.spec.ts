import { TestBed } from '@angular/core/testing';

import { ClasstaggingService } from './classtagging.service';

describe('ClasstaggingService', () => {
  let service: ClasstaggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasstaggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
