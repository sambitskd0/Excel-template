import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalFacilitiesInfoComponent } from './physical-facilities-info.component';

describe('PhysicalFacilitiesInfoComponent', () => {
  let component: PhysicalFacilitiesInfoComponent;
  let fixture: ComponentFixture<PhysicalFacilitiesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalFacilitiesInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalFacilitiesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
