import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalAuthorityComponent } from './view-approval-authority.component';

describe('ViewApprovalAuthorityComponent', () => {
  let component: ViewApprovalAuthorityComponent;
  let fixture: ComponentFixture<ViewApprovalAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApprovalAuthorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApprovalAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
