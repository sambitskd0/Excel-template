import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubjectTaggingComponent } from './view-subject-tagging.component';

describe('ViewSubjectTaggingComponent', () => {
  let component: ViewSubjectTaggingComponent;
  let fixture: ComponentFixture<ViewSubjectTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubjectTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubjectTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
