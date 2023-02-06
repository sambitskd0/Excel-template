import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTittleWiseReportComponent } from './teacher-tittle-wise-report.component';

describe('TeacherTittleWiseReportComponent', () => {
  let component: TeacherTittleWiseReportComponent;
  let fixture: ComponentFixture<TeacherTittleWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherTittleWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherTittleWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
