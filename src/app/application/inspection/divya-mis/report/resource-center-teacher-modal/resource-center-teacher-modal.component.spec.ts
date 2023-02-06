import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCenterTeacherModalComponent } from './resource-center-teacher-modal.component';

describe('ResourceCenterTeacherModalComponent', () => {
  let component: ResourceCenterTeacherModalComponent;
  let fixture: ComponentFixture<ResourceCenterTeacherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceCenterTeacherModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceCenterTeacherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
