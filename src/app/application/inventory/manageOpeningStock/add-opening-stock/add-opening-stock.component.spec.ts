import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpeningStockComponent } from './add-opening-stock.component';

describe('AddOpeningStockComponent', () => {
  let component: AddOpeningStockComponent;
  let fixture: ComponentFixture<AddOpeningStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpeningStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpeningStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
