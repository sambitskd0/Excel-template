import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtificialLimbCenterTeacherModalComponent } from './artificial-limb-center-teacher-modal.component';

describe('ArtificialLimbCenterTeacherModalComponent', () => {
  let component: ArtificialLimbCenterTeacherModalComponent;
  let fixture: ComponentFixture<ArtificialLimbCenterTeacherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtificialLimbCenterTeacherModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtificialLimbCenterTeacherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
