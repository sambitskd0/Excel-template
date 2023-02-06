import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOfficerNotificationComponent } from './view-officer-notification.component';

describe('ViewOfficerNotificationComponent', () => {
  let component: ViewOfficerNotificationComponent;
  let fixture: ComponentFixture<ViewOfficerNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOfficerNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOfficerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
