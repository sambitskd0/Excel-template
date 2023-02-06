import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceAtMyLabelComponent } from './grievance-at-my-label.component';

describe('GrievanceAtMyLabelComponent', () => {
  let component: GrievanceAtMyLabelComponent;
  let fixture: ComponentFixture<GrievanceAtMyLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceAtMyLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceAtMyLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
