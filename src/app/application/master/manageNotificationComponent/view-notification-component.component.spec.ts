import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotificationComponentComponent } from './view-notification-component.component';

describe('ViewNotificationComponentComponent', () => {
  let component: ViewNotificationComponentComponent;
  let fixture: ComponentFixture<ViewNotificationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNotificationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNotificationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
