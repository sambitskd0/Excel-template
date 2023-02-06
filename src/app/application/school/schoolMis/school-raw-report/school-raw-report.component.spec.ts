import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolRawReportComponent } from './school-raw-report.component';

describe('SchoolRawReportComponent', () => {
  let component: SchoolRawReportComponent;
  let fixture: ComponentFixture<SchoolRawReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolRawReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolRawReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
