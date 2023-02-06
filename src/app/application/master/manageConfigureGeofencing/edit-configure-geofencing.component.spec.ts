import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConfigureGeofencingComponent } from './edit-configure-geofencing.component';

describe('EditConfigureGeofencingComponent', () => {
  let component: EditConfigureGeofencingComponent;
  let fixture: ComponentFixture<EditConfigureGeofencingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConfigureGeofencingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConfigureGeofencingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
