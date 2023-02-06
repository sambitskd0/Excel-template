import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchoolTeacherNotificationComponent } from './add-school-teacher-notification.component';

describe('AddSchoolTeacherNotificationComponent', () => {
  let component: AddSchoolTeacherNotificationComponent;
  let fixture: ComponentFixture<AddSchoolTeacherNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSchoolTeacherNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSchoolTeacherNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
