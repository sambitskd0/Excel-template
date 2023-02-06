import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssessmentScheduleComponent } from './add-assessment-schedule.component';

describe('AddAssessmentScheduleComponent', () => {
  let component: AddAssessmentScheduleComponent;
  let fixture: ComponentFixture<AddAssessmentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssessmentScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssessmentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
