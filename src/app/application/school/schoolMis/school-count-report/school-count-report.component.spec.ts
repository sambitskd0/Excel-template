import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCountReportComponent } from './school-count-report.component';

describe('SchoolCountReportComponent', () => {
  let component: SchoolCountReportComponent;
  let fixture: ComponentFixture<SchoolCountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolCountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolCountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
