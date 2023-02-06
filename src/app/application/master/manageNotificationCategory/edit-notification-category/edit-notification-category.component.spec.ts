import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotificationCategoryComponent } from './edit-notification-category.component';

describe('EditNotificationCategoryComponent', () => {
  let component: EditNotificationCategoryComponent;
  let fixture: ComponentFixture<EditNotificationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNotificationCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotificationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
