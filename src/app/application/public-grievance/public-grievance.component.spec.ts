import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGrievanceComponent } from './public-grievance.component';

describe('PublicGrievanceComponent', () => {
  let component: PublicGrievanceComponent;
  let fixture: ComponentFixture<PublicGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicGrievanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
