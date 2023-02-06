import { TestBed } from '@angular/core/testing';

import { SchoolMediumOfInstructionService } from './school-medium-of-instruction.service';

describe('SchoolMediumOfInstructionService', () => {
  let service: SchoolMediumOfInstructionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolMediumOfInstructionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
