import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAttendanceReportComponent } from './teacher-attendance-report.component';

describe('TeacherAttendanceReportComponent', () => {
  let component: TeacherAttendanceReportComponent;
  let fixture: ComponentFixture<TeacherAttendanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAttendanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
