import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeedbackCategoryComponent } from './view-feedback-category.component';

describe('ViewFeedbackCategoryComponent', () => {
  let component: ViewFeedbackCategoryComponent;
  let fixture: ComponentFixture<ViewFeedbackCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFeedbackCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFeedbackCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
