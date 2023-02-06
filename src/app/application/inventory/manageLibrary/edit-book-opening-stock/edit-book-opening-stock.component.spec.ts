import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookOpeningStockComponent } from './edit-book-opening-stock.component';

describe('EditBookOpeningStockComponent', () => {
  let component: EditBookOpeningStockComponent;
  let fixture: ComponentFixture<EditBookOpeningStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBookOpeningStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookOpeningStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
