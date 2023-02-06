import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeWiseStudentComponent } from './grade-wise-student.component';

describe('GradeWiseStudentComponent', () => {
  let component: GradeWiseStudentComponent;
  let fixture: ComponentFixture<GradeWiseStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeWiseStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeWiseStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
