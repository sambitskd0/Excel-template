import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyConsumptionReportComponent } from './daily-consumption-report.component';

describe('DailyConsumptionReportComponent', () => {
  let component: DailyConsumptionReportComponent;
  let fixture: ComponentFixture<DailyConsumptionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyConsumptionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyConsumptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
