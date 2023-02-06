import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeaveApplyComponent } from './view-leave-apply.component';

describe('ViewLeaveApplyComponent', () => {
  let component: ViewLeaveApplyComponent;
  let fixture: ComponentFixture<ViewLeaveApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLeaveApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLeaveApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
