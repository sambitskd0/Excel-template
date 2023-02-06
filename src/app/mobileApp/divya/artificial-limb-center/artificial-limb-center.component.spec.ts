import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtificialLimbCenterComponent } from './artificial-limb-center.component';

describe('ArtificialLimbCenterComponent', () => {
  let component: ArtificialLimbCenterComponent;
  let fixture: ComponentFixture<ArtificialLimbCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtificialLimbCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtificialLimbCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
