import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClassTeacherTaggingComponent } from './edit-class-teacher-tagging.component';

describe('EditClassTeacherTaggingComponent', () => {
  let component: EditClassTeacherTaggingComponent;
  let fixture: ComponentFixture<EditClassTeacherTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClassTeacherTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClassTeacherTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
