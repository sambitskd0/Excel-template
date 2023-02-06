import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSurveyModalComponent } from './school-survey-modal.component';

describe('SchoolSurveyModalComponent', () => {
  let component: SchoolSurveyModalComponent;
  let fixture: ComponentFixture<SchoolSurveyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolSurveyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSurveyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
