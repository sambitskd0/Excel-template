import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionMisComponent } from './inspection-mis.component';

describe('InspectionMisComponent', () => {
  let component: InspectionMisComponent;
  let fixture: ComponentFixture<InspectionMisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionMisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
