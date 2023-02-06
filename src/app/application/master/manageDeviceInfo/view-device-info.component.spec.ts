import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeviceInfoComponent } from './view-device-info.component';

describe('ViewDeviceInfoComponent', () => {
  let component: ViewDeviceInfoComponent;
  let fixture: ComponentFixture<ViewDeviceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeviceInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeviceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
