import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOpeningStockComponent } from './update-opening-stock.component';

describe('UpdateOpeningStockComponent', () => {
  let component: UpdateOpeningStockComponent;
  let fixture: ComponentFixture<UpdateOpeningStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOpeningStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOpeningStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
