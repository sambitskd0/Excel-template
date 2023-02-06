import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentAchievementComponent } from './add-student-achievement.component';

describe('AddStudentAchievementComponent', () => {
  let component: AddStudentAchievementComponent;
  let fixture: ComponentFixture<AddStudentAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStudentAchievementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
