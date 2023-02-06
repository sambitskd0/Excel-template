import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubjectTaggingComponent } from './edit-subject-tagging.component';

describe('EditSubjectTaggingComponent', () => {
  let component: EditSubjectTaggingComponent;
  let fixture: ComponentFixture<EditSubjectTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubjectTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubjectTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
