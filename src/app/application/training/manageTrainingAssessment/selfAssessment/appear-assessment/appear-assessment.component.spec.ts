import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearAssessmentComponent } from './appear-assessment.component';

describe('AppearAssessmentComponent', () => {
  let component: AppearAssessmentComponent;
  let fixture: ComponentFixture<AppearAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppearAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
