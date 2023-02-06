import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotificationComponent } from '../edit-notification/edit-teacher.component';

describe('EditTeacherComponent', () => {
  let component: EditNotificationComponent;
  let fixture: ComponentFixture<EditNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
