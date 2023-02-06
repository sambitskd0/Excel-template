import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMdmAttendanceComponent } from './view-mdm-attendance.component';

describe('ViewMdmAttendanceComponent', () => {
  let component: ViewMdmAttendanceComponent;
  let fixture: ComponentFixture<ViewMdmAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMdmAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMdmAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
