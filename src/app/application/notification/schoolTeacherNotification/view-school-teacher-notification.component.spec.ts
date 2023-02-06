import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSchoolTeacherNotificationComponent } from './view-school-teacher-notification.component';

describe('ViewSchoolTeacherNotificationComponent', () => {
  let component: ViewSchoolTeacherNotificationComponent;
  let fixture: ComponentFixture<ViewSchoolTeacherNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSchoolTeacherNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSchoolTeacherNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
