import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalQualiWiseReportComponent } from './educational-quali-wise-report.component';

describe('EducationalQualiWiseReportComponent', () => {
  let component: EducationalQualiWiseReportComponent;
  let fixture: ComponentFixture<EducationalQualiWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalQualiWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalQualiWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
