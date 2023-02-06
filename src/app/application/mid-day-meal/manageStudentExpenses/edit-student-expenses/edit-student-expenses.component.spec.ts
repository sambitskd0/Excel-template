import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentExpensesComponent } from './edit-student-expenses.component';

describe('EditStudentExpensesComponent', () => {
  let component: EditStudentExpensesComponent;
  let fixture: ComponentFixture<EditStudentExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStudentExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStudentExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
