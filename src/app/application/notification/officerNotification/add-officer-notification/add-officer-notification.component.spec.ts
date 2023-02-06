import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfficerNotificationComponent } from './add-officer-notification.component';

describe('AddOfficerNotificationComponent', () => {
  let component: AddOfficerNotificationComponent;
  let fixture: ComponentFixture<AddOfficerNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfficerNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfficerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
