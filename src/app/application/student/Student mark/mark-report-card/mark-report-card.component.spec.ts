import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkReportCardComponent } from './mark-report-card.component';

describe('MarkReportCardComponent', () => {
  let component: MarkReportCardComponent;
  let fixture: ComponentFixture<MarkReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkReportCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
