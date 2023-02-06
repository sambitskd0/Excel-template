import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAbsentCountReportComponent } from './teacher-absent-count-report.component';

describe('TeacherAbsentCountReportComponent', () => {
  let component: TeacherAbsentCountReportComponent;
  let fixture: ComponentFixture<TeacherAbsentCountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAbsentCountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAbsentCountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
