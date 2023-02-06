import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenditureTypeComponent } from './add-expenditure-type.component';

describe('AddExpenditureTypeComponent', () => {
  let component: AddExpenditureTypeComponent;
  let fixture: ComponentFixture<AddExpenditureTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpenditureTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpenditureTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
