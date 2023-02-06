import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportListComponent } from './view-report-list.component';

describe('ViewReportListComponent', () => {
  let component: ViewReportListComponent;
  let fixture: ComponentFixture<ViewReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
