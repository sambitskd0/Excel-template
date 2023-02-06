import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentAchievementComponent } from './edit-student-achievement.component';

describe('EditStudentAchievementComponent', () => {
  let component: EditStudentAchievementComponent;
  let fixture: ComponentFixture<EditStudentAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStudentAchievementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStudentAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
