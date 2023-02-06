import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetApprovalAuthorityComponent } from './set-approval-authority.component';

describe('SetApprovalAuthorityComponent', () => {
  let component: SetApprovalAuthorityComponent;
  let fixture: ComponentFixture<SetApprovalAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetApprovalAuthorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetApprovalAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
