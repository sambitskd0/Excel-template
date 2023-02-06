import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentScheduleComponent } from './view-assessment-schedule.component';

describe('ViewAssessmentScheduleComponent', () => {
  let component: ViewAssessmentScheduleComponent;
  let fixture: ComponentFixture<ViewAssessmentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssessmentScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssessmentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
