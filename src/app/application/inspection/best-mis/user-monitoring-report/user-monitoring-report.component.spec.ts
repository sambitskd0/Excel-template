import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMonitoringReportComponent } from './user-monitoring-report.component';

describe('UserMonitoringReportComponent', () => {
  let component: UserMonitoringReportComponent;
  let fixture: ComponentFixture<UserMonitoringReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMonitoringReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMonitoringReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
