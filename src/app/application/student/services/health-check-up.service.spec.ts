import { TestBed } from '@angular/core/testing';

import { HealthCheckUpService } from './health-check-up.service';

describe('HealthCheckUpService', () => {
  let service: HealthCheckUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthCheckUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
