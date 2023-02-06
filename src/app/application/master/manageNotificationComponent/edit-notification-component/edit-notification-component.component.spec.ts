import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotificationComponentComponent } from './edit-notification-component.component';

describe('EditNotificationComponentComponent', () => {
  let component: EditNotificationComponentComponent;
  let fixture: ComponentFixture<EditNotificationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNotificationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotificationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
