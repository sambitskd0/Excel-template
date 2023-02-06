import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClassTeacherTaggingComponent } from './view-class-teacher-tagging.component';

describe('ViewClassTeacherTaggingComponent', () => {
  let component: ViewClassTeacherTaggingComponent;
  let fixture: ComponentFixture<ViewClassTeacherTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClassTeacherTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClassTeacherTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
