import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputersAndDigitalInitiativesComponent } from './computers-and-digital-initiatives.component';

describe('ComputersAndDigitalInitiativesComponent', () => {
  let component: ComputersAndDigitalInitiativesComponent;
  let fixture: ComponentFixture<ComputersAndDigitalInitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputersAndDigitalInitiativesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputersAndDigitalInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
