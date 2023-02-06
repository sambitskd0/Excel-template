import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttendanceReportPanchayatWiseComponent } from './student-attendance-report-panchayat-wise.component';

describe('StudentAttendanceReportPanchayatWiseComponent', () => {
  let component: StudentAttendanceReportPanchayatWiseComponent;
  let fixture: ComponentFixture<StudentAttendanceReportPanchayatWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAttendanceReportPanchayatWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAttendanceReportPanchayatWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
