import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCenterModalComponent } from './resource-center-modal.component';

describe('ResourceCenterModalComponent', () => {
  let component: ResourceCenterModalComponent;
  let fixture: ComponentFixture<ResourceCenterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceCenterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceCenterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
