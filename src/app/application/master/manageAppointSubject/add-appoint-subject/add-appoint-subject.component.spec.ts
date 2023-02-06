import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointSubjectComponent } from './add-appoint-subject.component';

describe('AddAppointSubjectComponent', () => {
  let component: AddAppointSubjectComponent;
  let fixture: ComponentFixture<AddAppointSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAppointSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppointSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
