import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolInspectionReportComponent } from './school-inspection-report.component';

describe('SchoolInspectionReportComponent', () => {
  let component: SchoolInspectionReportComponent;
  let fixture: ComponentFixture<SchoolInspectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolInspectionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolInspectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
