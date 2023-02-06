import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookOpeningStockComponent } from './add-book-opening-stock.component';

describe('AddBookOpeningStockComponent', () => {
  let component: AddBookOpeningStockComponent;
  let fixture: ComponentFixture<AddBookOpeningStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBookOpeningStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookOpeningStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
