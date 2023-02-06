import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationComponentComponent } from './add-notification-component.component';

describe('AddNotificationComponentComponent', () => {
  let component: AddNotificationComponentComponent;
  let fixture: ComponentFixture<AddNotificationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNotificationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotificationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
