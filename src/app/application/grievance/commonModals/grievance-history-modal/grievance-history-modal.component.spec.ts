import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceHistoryModalComponent } from './grievance-history-modal.component';

describe('GrievanceHistoryModalComponent', () => {
  let component: GrievanceHistoryModalComponent;
  let fixture: ComponentFixture<GrievanceHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
