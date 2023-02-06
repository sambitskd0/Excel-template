import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassTeacherTaggingComponent } from './add-class-teacher-tagging.component';

describe('AddClassTeacherTaggingComponent', () => {
  let component: AddClassTeacherTaggingComponent;
  let fixture: ComponentFixture<AddClassTeacherTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClassTeacherTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassTeacherTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
