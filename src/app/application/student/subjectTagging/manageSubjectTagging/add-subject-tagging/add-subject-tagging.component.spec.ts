import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectTaggingComponent } from './add-subject-tagging.component';

describe('AddSubjectTaggingComponent', () => {
  let component: AddSubjectTaggingComponent;
  let fixture: ComponentFixture<AddSubjectTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubjectTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubjectTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
