import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotificationCategoryComponent } from './view-notification-category.component';

describe('ViewNotificationCategoryComponent', () => {
  let component: ViewNotificationCategoryComponent;
  let fixture: ComponentFixture<ViewNotificationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNotificationCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNotificationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
