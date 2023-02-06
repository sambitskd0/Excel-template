import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTeacherComponent } from './training-teacher.component';

describe('TrainingTeacherComponent', () => {
  let component: TrainingTeacherComponent;
  let fixture: ComponentFixture<TrainingTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
