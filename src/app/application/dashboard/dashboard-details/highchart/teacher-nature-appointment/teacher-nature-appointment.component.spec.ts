import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherNatureAppointmentComponent } from './teacher-nature-appointment.component';

describe('TeacherNatureAppointmentComponent', () => {
  let component: TeacherNatureAppointmentComponent;
  let fixture: ComponentFixture<TeacherNatureAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherNatureAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherNatureAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
