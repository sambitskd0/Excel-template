import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolStatusPanchayatWiseReportComponent } from './school-status-panchayat-wise-report.component';

describe('SchoolStatusPanchayatWiseReportComponent', () => {
  let component: SchoolStatusPanchayatWiseReportComponent;
  let fixture: ComponentFixture<SchoolStatusPanchayatWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolStatusPanchayatWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolStatusPanchayatWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
