import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentExpensesComponent } from './view-student-expenses.component';

describe('ViewStudentExpensesComponent', () => {
  let component: ViewStudentExpensesComponent;
  let fixture: ComponentFixture<ViewStudentExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
