import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointSubjectComponent } from './view-appoint-subject.component';

describe('ViewAppointSubjectComponent', () => {
  let component: ViewAppointSubjectComponent;
  let fixture: ComponentFixture<ViewAppointSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAppointSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppointSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
