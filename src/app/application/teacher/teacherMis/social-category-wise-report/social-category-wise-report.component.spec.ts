import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialCategoryWiseReportComponent } from './social-category-wise-report.component';

describe('SocialCategoryWiseReportComponent', () => {
  let component: SocialCategoryWiseReportComponent;
  let fixture: ComponentFixture<SocialCategoryWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialCategoryWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialCategoryWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
