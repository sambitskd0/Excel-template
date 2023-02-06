import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockInComponent } from './view-stock-in.component';

describe('ViewStockInComponent', () => {
  let component: ViewStockInComponent;
  let fixture: ComponentFixture<ViewStockInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStockInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStockInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
