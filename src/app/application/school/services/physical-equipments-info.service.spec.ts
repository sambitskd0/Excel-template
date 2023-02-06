import { TestBed } from '@angular/core/testing';

import { PhysicalEquipmentsInfoService } from './physical-equipments-info.service';

describe('PhysicalEquipmentsInfoService', () => {
  let service: PhysicalEquipmentsInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalEquipmentsInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
