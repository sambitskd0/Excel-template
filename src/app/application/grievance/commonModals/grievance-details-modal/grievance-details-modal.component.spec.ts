import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceDetailsModalComponent } from './grievance-details-modal.component';

describe('GrievanceDetailsModalComponent', () => {
  let component: GrievanceDetailsModalComponent;
  let fixture: ComponentFixture<GrievanceDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
