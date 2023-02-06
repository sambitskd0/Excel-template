import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMdmDailyMenuComponent } from './view-mdm-daily-menu.component';

describe('ViewMdmDailyMenuComponent', () => {
  let component: ViewMdmDailyMenuComponent;
  let fixture: ComponentFixture<ViewMdmDailyMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMdmDailyMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMdmDailyMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
