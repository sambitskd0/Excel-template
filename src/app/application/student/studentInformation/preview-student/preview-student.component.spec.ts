import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewStudentComponent } from './preview-student.component';

describe('PreviewStudentComponent', () => {
  let component: PreviewStudentComponent;
  let fixture: ComponentFixture<PreviewStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
