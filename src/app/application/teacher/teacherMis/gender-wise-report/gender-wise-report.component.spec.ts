import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderWiseReportComponent } from './gender-wise-report.component';

describe('GenderWiseReportComponent', () => {
  let component: GenderWiseReportComponent;
  let fixture: ComponentFixture<GenderWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenderWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
