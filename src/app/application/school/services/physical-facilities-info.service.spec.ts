import { TestBed } from '@angular/core/testing';

import { PhysicalFacilitiesInfoService } from './physical-facilities-info.service';

describe('PhysicalFacilitiesInfoService', () => {
  let service: PhysicalFacilitiesInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalFacilitiesInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
