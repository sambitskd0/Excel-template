import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentMarkComponent } from './view-student-mark.component';

describe('ViewStudentMarkComponent', () => {
  let component: ViewStudentMarkComponent;
  let fixture: ComponentFixture<ViewStudentMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentMarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
