import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOpeningStockComponent } from './view-opening-stock.component';

describe('ViewOpeningStockComponent', () => {
  let component: ViewOpeningStockComponent;
  let fixture: ComponentFixture<ViewOpeningStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOpeningStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOpeningStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
