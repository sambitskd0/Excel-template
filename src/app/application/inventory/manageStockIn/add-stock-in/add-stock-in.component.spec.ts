import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockInComponent } from './add-stock-in.component';

describe('AddStockInComponent', () => {
  let component: AddStockInComponent;
  let fixture: ComponentFixture<AddStockInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStockInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
