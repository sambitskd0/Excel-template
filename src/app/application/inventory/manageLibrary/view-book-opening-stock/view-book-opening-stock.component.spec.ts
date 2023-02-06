import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookOpeningStockComponent } from './view-book-opening-stock.component';

describe('ViewBookOpeningStockComponent', () => {
  let component: ViewBookOpeningStockComponent;
  let fixture: ComponentFixture<ViewBookOpeningStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBookOpeningStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookOpeningStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
