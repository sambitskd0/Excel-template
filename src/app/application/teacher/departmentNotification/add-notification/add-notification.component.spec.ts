import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationComponent } from './add-teacher.component';

describe('AddTeacherComponent', () => {
  let component: AddNotificationComponent;
  let fixture: ComponentFixture<AddNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
