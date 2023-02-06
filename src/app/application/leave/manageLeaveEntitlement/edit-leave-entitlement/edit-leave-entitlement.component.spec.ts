import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeaveEntitlementComponent } from './edit-leave-entitlement.component';

describe('EditLeaveEntitlementComponent', () => {
  let component: EditLeaveEntitlementComponent;
  let fixture: ComponentFixture<EditLeaveEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLeaveEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLeaveEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
