import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAppointmentTypeComponent } from './teacher-appointment-type.component';

describe('TeacherAppointmentTypeComponent', () => {
  let component: TeacherAppointmentTypeComponent;
  let fixture: ComponentFixture<TeacherAppointmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAppointmentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAppointmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
