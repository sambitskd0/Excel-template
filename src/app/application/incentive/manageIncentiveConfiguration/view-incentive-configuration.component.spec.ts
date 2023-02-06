import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIncentiveConfigurationComponent } from './view-incentive-configuration.component';

describe('ViewIncentiveConfigurationComponent', () => {
  let component: ViewIncentiveConfigurationComponent;
  let fixture: ComponentFixture<ViewIncentiveConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIncentiveConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIncentiveConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
