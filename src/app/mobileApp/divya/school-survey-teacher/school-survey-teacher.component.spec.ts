import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSurveyTeacherComponent } from './school-survey-teacher.component';

describe('SchoolSurveyTeacherComponent', () => {
  let component: SchoolSurveyTeacherComponent;
  let fixture: ComponentFixture<SchoolSurveyTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolSurveyTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSurveyTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
