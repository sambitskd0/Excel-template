import { TestBed } from '@angular/core/testing';

import { TeacherTransferService } from './teacher-transfer.service';

describe('TeacherTransferService', () => {
  let service: TeacherTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
