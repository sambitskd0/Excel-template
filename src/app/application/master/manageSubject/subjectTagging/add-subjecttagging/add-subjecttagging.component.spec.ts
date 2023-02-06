import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjecttaggingComponent } from './add-subjecttagging.component';

describe('AddSubjecttaggingComponent', () => {
  let component: AddSubjecttaggingComponent;
  let fixture: ComponentFixture<AddSubjecttaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubjecttaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubjecttaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
