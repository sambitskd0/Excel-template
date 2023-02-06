import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureAppointmentWiseTeacherReportComponent } from './nature-appointment-wise-teacher-report.component';

describe('NatureAppointmentWiseTeacherReportComponent', () => {
  let component: NatureAppointmentWiseTeacherReportComponent;
  let fixture: ComponentFixture<NatureAppointmentWiseTeacherReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NatureAppointmentWiseTeacherReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureAppointmentWiseTeacherReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
