import { TestBed } from '@angular/core/testing';

import { LibraryattendanceService } from './libraryattendance.service';

describe('LibraryattendanceService', () => {
  let service: LibraryattendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryattendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
