import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveEntitlementComponent } from './add-leave-entitlement.component';

describe('AddLeaveEntitlementComponent', () => {
  let component: AddLeaveEntitlementComponent;
  let fixture: ComponentFixture<AddLeaveEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeaveEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeaveEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
