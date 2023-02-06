import { TestBed } from '@angular/core/testing';

import { ManageSubdesignationService } from './manage-subdesignation.service';

describe('ManageSubdesignationService', () => {
  let service: ManageSubdesignationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSubdesignationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
