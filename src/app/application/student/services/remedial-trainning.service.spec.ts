import { TestBed } from '@angular/core/testing';

import { RemedialTrainningService } from './remedial-trainning.service';

describe('RemedialTrainningService', () => {
  let service: RemedialTrainningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemedialTrainningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
