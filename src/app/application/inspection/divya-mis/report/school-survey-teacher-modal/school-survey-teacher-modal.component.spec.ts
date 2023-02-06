import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSurveyTeacherModalComponent } from './school-survey-teacher-modal.component';

describe('SchoolSurveyTeacherModalComponent', () => {
  let component: SchoolSurveyTeacherModalComponent;
  let fixture: ComponentFixture<SchoolSurveyTeacherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolSurveyTeacherModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSurveyTeacherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
