import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentExpensesComponent } from './add-student-expenses.component';

describe('AddStudentExpensesComponent', () => {
  let component: AddStudentExpensesComponent;
  let fixture: ComponentFixture<AddStudentExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStudentExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
