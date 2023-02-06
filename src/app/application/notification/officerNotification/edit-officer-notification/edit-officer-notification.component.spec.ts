import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfficerNotificationComponent } from './edit-officer-notification.component';

describe('EditOfficerNotificationComponent', () => {
  let component: EditOfficerNotificationComponent;
  let fixture: ComponentFixture<EditOfficerNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOfficerNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfficerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
