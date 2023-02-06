import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeaveEntitlementComponent } from './view-leave-entitlement.component';

describe('ViewLeaveEntitlementComponent', () => {
  let component: ViewLeaveEntitlementComponent;
  let fixture: ComponentFixture<ViewLeaveEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLeaveEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLeaveEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
