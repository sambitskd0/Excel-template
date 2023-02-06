import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalQualiWiseReportComponent } from './professional-quali-wise-report.component';

describe('ProfessionalQualiWiseReportComponent', () => {
  let component: ProfessionalQualiWiseReportComponent;
  let fixture: ComponentFixture<ProfessionalQualiWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalQualiWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalQualiWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
