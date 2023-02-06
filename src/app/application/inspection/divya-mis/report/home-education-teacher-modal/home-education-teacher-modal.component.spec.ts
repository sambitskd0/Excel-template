import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEducationTeacherModalComponent } from './home-education-teacher-modal.component';

describe('HomeEducationTeacherModalComponent', () => {
  let component: HomeEducationTeacherModalComponent;
  let fixture: ComponentFixture<HomeEducationTeacherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeEducationTeacherModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEducationTeacherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
