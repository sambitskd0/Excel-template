import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchoolTeacherNotificationComponent } from './edit-school-teacher-notification.component';

describe('EditSchoolTeacherNotificationComponent', () => {
  let component: EditSchoolTeacherNotificationComponent;
  let fixture: ComponentFixture<EditSchoolTeacherNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSchoolTeacherNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSchoolTeacherNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
