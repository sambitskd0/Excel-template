import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolVerificationReportComponent } from './school-verification-report.component';

describe('SchoolVerificationReportComponent', () => {
  let component: SchoolVerificationReportComponent;
  let fixture: ComponentFixture<SchoolVerificationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolVerificationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolVerificationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
