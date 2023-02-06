import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOpeningStockComponent } from './edit-opening-stock.component';

describe('EditOpeningStockComponent', () => {
  let component: EditOpeningStockComponent;
  let fixture: ComponentFixture<EditOpeningStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOpeningStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOpeningStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
