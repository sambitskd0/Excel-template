import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceInfoComponent } from './add-device-info.component';

describe('AddDeviceInfoComponent', () => {
  let component: AddDeviceInfoComponent;
  let fixture: ComponentFixture<AddDeviceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeviceInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeviceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
