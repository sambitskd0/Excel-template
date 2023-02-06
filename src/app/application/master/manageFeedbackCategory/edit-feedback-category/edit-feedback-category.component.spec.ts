import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeedbackCategoryComponent } from './edit-feedback-category.component';

describe('EditFeedbackCategoryComponent', () => {
  let component: EditFeedbackCategoryComponent;
  let fixture: ComponentFixture<EditFeedbackCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFeedbackCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFeedbackCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
