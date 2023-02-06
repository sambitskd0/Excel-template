import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeedbackCategoryComponent } from './add-feedback-category.component';

describe('AddFeedbackCategoryComponent', () => {
  let component: AddFeedbackCategoryComponent;
  let fixture: ComponentFixture<AddFeedbackCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeedbackCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeedbackCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
