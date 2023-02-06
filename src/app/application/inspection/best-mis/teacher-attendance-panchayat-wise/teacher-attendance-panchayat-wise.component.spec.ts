import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAttendancePanchayatWiseComponent } from './teacher-attendance-panchayat-wise.component';

describe('TeacherAttendancePanchayatWiseComponent', () => {
  let component: TeacherAttendancePanchayatWiseComponent;
  let fixture: ComponentFixture<TeacherAttendancePanchayatWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAttendancePanchayatWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAttendancePanchayatWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
