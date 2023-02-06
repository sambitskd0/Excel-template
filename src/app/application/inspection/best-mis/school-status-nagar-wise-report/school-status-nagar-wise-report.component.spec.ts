import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolStatusNagarWiseReportComponent } from './school-status-nagar-wise-report.component';

describe('SchoolStatusNagarWiseReportComponent', () => {
  let component: SchoolStatusNagarWiseReportComponent;
  let fixture: ComponentFixture<SchoolStatusNagarWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolStatusNagarWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolStatusNagarWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
