import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssetItemComponent } from './view-asset-item.component';

describe('ViewAssetItemComponent', () => {
  let component: ViewAssetItemComponent;
  let fixture: ComponentFixture<ViewAssetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssetItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
