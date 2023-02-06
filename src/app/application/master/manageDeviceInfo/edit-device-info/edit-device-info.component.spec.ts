import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeviceInfoComponent } from './edit-device-info.component';

describe('EditDeviceInfoComponent', () => {
  let component: EditDeviceInfoComponent;
  let fixture: ComponentFixture<EditDeviceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeviceInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeviceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
