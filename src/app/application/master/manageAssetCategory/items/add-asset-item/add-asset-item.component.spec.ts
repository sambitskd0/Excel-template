import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetItemComponent } from './add-asset-item.component';

describe('AddAssetItemComponent', () => {
  let component: AddAssetItemComponent;
  let fixture: ComponentFixture<AddAssetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssetItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
