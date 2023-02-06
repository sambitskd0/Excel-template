import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeacherTransferComponent } from './view-teacher-transfer.component';

describe('ViewTeacherTransferComponent', () => {
  let component: ViewTeacherTransferComponent;
  let fixture: ComponentFixture<ViewTeacherTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTeacherTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTeacherTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
