import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyWorkModalComponent } from './survey-work-modal.component';

describe('SurveyWorkModalComponent', () => {
  let component: SurveyWorkModalComponent;
  let fixture: ComponentFixture<SurveyWorkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyWorkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyWorkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
