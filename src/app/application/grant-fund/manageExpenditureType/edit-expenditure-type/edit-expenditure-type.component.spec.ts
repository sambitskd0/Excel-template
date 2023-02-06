import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpenditureTypeComponent } from './edit-expenditure-type.component';

describe('EditExpenditureTypeComponent', () => {
  let component: EditExpenditureTypeComponent;
  let fixture: ComponentFixture<EditExpenditureTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExpenditureTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExpenditureTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
