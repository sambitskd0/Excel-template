import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPortalNotificationComponent } from './view-portal-notification.component';

describe('ViewPortalNotificationComponent', () => {
  let component: ViewPortalNotificationComponent;
  let fixture: ComponentFixture<ViewPortalNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPortalNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPortalNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
