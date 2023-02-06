import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtificialLimbCenterTeacherComponent } from './artificial-limb-center-teacher.component';

describe('ArtificialLimbCenterTeacherComponent', () => {
  let component: ArtificialLimbCenterTeacherComponent;
  let fixture: ComponentFixture<ArtificialLimbCenterTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtificialLimbCenterTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtificialLimbCenterTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
