import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointSubjectComponent } from './edit-appoint-subject.component';

describe('EditAppointSubjectComponent', () => {
  let component: EditAppointSubjectComponent;
  let fixture: ComponentFixture<EditAppointSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAppointSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppointSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
