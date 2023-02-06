import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssesmentQuestionComponent } from './edit-assesment-question.component';

describe('EditAssesmentQuestionComponent', () => {
  let component: EditAssesmentQuestionComponent;
  let fixture: ComponentFixture<EditAssesmentQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssesmentQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssesmentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
