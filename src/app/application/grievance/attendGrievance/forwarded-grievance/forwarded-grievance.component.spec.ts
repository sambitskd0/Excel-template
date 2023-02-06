import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardedGrievanceComponent } from './forwarded-grievance.component';

describe('ForwardedGrievanceComponent', () => {
  let component: ForwardedGrievanceComponent;
  let fixture: ComponentFixture<ForwardedGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardedGrievanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardedGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
