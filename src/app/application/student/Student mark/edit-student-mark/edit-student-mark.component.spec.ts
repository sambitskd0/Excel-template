import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentMarkComponent } from './edit-student-mark.component';

describe('EditStudentMarkComponent', () => {
  let component: EditStudentMarkComponent;
  let fixture: ComponentFixture<EditStudentMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStudentMarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStudentMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
