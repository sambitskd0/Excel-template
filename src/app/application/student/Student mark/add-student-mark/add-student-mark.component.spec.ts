import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentMarkComponent } from './add-student-mark.component';

describe('AddStudentMarkComponent', () => {
  let component: AddStudentMarkComponent;
  let fixture: ComponentFixture<AddStudentMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStudentMarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
