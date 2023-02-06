import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasteWiseEnrollmentReportComponent } from './caste-wise-enrollment-report.component';

describe('CasteWiseEnrollmentReportComponent', () => {
  let component: CasteWiseEnrollmentReportComponent;
  let fixture: ComponentFixture<CasteWiseEnrollmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasteWiseEnrollmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasteWiseEnrollmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
