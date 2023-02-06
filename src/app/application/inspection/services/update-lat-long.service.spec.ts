import { TestBed } from '@angular/core/testing';

import { UpdateLatLongService } from './update-lat-long.service';

describe('UpdateLatLongService', () => {
  let service: UpdateLatLongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateLatLongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
