import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationCategoryComponent } from './add-notification-category.component';

describe('AddNotificationCategoryComponent', () => {
  let component: AddNotificationCategoryComponent;
  let fixture: ComponentFixture<AddNotificationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNotificationCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotificationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
