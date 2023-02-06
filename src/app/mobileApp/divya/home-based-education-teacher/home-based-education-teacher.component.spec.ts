import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBasedEducationTeacherComponent } from './home-based-education-teacher.component';

describe('HomeBasedEducationTeacherComponent', () => {
  let component: HomeBasedEducationTeacherComponent;
  let fixture: ComponentFixture<HomeBasedEducationTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeBasedEducationTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBasedEducationTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
