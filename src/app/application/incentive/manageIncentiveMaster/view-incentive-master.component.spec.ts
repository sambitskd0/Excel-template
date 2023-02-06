import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIncentiveMasterComponent } from './view-incentive-master.component';

describe('ViewIncentiveMasterComponent', () => {
  let component: ViewIncentiveMasterComponent;
  let fixture: ComponentFixture<ViewIncentiveMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIncentiveMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIncentiveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
