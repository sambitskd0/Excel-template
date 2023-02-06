import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpeningBalanceComponent } from './add-opening-balance.component';

describe('AddOpeningBalanceComponent', () => {
  let component: AddOpeningBalanceComponent;
  let fixture: ComponentFixture<AddOpeningBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpeningBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpeningBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
