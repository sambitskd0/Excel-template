import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetCategoryComponent } from './edit-asset-category.component';

describe('EditAssetCategoryComponent', () => {
  let component: EditAssetCategoryComponent;
  let fixture: ComponentFixture<EditAssetCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssetCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
