import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolMdmPanchayatWiseReportComponent } from './school-mdm-panchayat-wise-report.component';

describe('SchoolMdmPanchayatWiseReportComponent', () => {
  let component: SchoolMdmPanchayatWiseReportComponent;
  let fixture: ComponentFixture<SchoolMdmPanchayatWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolMdmPanchayatWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolMdmPanchayatWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
