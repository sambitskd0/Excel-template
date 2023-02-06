import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentAchievementComponent } from './view-student-achievement.component';

describe('ViewStudentAchievementComponent', () => {
  let component: ViewStudentAchievementComponent;
  let fixture: ComponentFixture<ViewStudentAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentAchievementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
