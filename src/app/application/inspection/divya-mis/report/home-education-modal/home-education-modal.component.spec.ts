import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEducationModalComponent } from './home-education-modal.component';

describe('HomeEducationModalComponent', () => {
  let component: HomeEducationModalComponent;
  let fixture: ComponentFixture<HomeEducationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeEducationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEducationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
