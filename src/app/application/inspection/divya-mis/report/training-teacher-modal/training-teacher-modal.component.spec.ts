import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTeacherModalComponent } from './training-teacher-modal.component';

describe('TrainingTeacherModalComponent', () => {
  let component: TrainingTeacherModalComponent;
  let fixture: ComponentFixture<TrainingTeacherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingTeacherModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingTeacherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
