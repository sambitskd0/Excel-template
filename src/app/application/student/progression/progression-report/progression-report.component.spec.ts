import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressionReportComponent } from './progression-report.component';

describe('ProgressionReportComponent', () => {
  let component: ProgressionReportComponent;
  let fixture: ComponentFixture<ProgressionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
