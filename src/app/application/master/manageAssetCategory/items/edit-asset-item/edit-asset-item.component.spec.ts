import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetItemComponent } from './edit-asset-item.component';

describe('EditAssetItemComponent', () => {
  let component: EditAssetItemComponent;
  let fixture: ComponentFixture<EditAssetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssetItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
