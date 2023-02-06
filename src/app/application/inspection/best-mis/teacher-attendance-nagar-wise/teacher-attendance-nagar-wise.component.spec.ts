import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAttendanceNagarWiseComponent } from './teacher-attendance-nagar-wise.component';

describe('TeacherAttendanceNagarWiseComponent', () => {
  let component: TeacherAttendanceNagarWiseComponent;
  let fixture: ComponentFixture<TeacherAttendanceNagarWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAttendanceNagarWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAttendanceNagarWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
