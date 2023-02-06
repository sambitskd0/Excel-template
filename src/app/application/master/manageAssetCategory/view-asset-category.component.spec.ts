import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssetCategoryComponent } from './view-asset-category.component';

describe('ViewAssetCategoryComponent', () => {
  let component: ViewAssetCategoryComponent;
  let fixture: ComponentFixture<ViewAssetCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssetCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
