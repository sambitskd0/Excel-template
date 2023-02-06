import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockInComponent } from './edit-stock-in.component';

describe('EditStockInComponent', () => {
  let component: EditStockInComponent;
  let fixture: ComponentFixture<EditStockInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
