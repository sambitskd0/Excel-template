import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMdmAttendanceComponent } from './add-mdm-attendance.component';

describe('AddMdmAttendanceComponent', () => {
  let component: AddMdmAttendanceComponent;
  let fixture: ComponentFixture<AddMdmAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMdmAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMdmAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
