import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalEquipmentsInfoComponent } from './physical-equipments-info.component';

describe('PhysicalEquipmentsInfoComponent', () => {
  let component: PhysicalEquipmentsInfoComponent;
  let fixture: ComponentFixture<PhysicalEquipmentsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalEquipmentsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalEquipmentsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
