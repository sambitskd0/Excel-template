import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeacherTransferRequestComponent } from './view-teacher-transfer-request.component';

describe('ViewTeacherTransferRequestComponent', () => {
  let component: ViewTeacherTransferRequestComponent;
  let fixture: ComponentFixture<ViewTeacherTransferRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTeacherTransferRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTeacherTransferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
