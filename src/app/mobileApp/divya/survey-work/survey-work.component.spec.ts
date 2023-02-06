import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyWorkComponent } from './survey-work.component';

describe('SurveyWorkComponent', () => {
  let component: SurveyWorkComponent;
  let fixture: ComponentFixture<SurveyWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
