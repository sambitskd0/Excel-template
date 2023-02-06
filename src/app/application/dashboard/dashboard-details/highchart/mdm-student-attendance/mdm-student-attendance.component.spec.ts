import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdmStudentAttendanceComponent } from './mdm-student-attendance.component';

describe('MdmStudentAttendanceComponent', () => {
  let component: MdmStudentAttendanceComponent;
  let fixture: ComponentFixture<MdmStudentAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdmStudentAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdmStudentAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
