import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtificialLimbCenterModalComponent } from './artificial-limb-center-modal.component';

describe('ArtificialLimbCenterModalComponent', () => {
  let component: ArtificialLimbCenterModalComponent;
  let fixture: ComponentFixture<ArtificialLimbCenterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtificialLimbCenterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtificialLimbCenterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
