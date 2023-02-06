import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockStatusComponent } from './view-stock-status.component';

describe('ViewStockStatusComponent', () => {
  let component: ViewStockStatusComponent;
  let fixture: ComponentFixture<ViewStockStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStockStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStockStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
