import { TestBed } from '@angular/core/testing';

import { ManageSubCategoryService } from './manage-sub-category.service';

describe('ManageSubCategoryService', () => {
  let service: ManageSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
