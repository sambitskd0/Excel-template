import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveApplyComponent } from './add-leave-apply.component';

describe('AddLeaveApplyComponent', () => {
  let component: AddLeaveApplyComponent;
  let fixture: ComponentFixture<AddLeaveApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeaveApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeaveApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
