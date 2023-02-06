import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolManagementWiseDetailsComponent } from './school-management-wise-details.component';

describe('SchoolManagementWiseDetailsComponent', () => {
  let component: SchoolManagementWiseDetailsComponent;
  let fixture: ComponentFixture<SchoolManagementWiseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolManagementWiseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolManagementWiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
