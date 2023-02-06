import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssessmentScheduleComponent } from './edit-assessment-schedule.component';

describe('EditAssessmentScheduleComponent', () => {
  let component: EditAssessmentScheduleComponent;
  let fixture: ComponentFixture<EditAssessmentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssessmentScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssessmentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
