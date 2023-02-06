import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDoctorDetailsComponent } from './view-doctor-details.component';

describe('ViewDoctorDetailsComponent', () => {
  let component: ViewDoctorDetailsComponent;
  let fixture: ComponentFixture<ViewDoctorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDoctorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDoctorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
