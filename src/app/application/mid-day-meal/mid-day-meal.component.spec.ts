import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidDayMealComponent } from './mid-day-meal.component';

describe('MidDayMealComponent', () => {
  let component: MidDayMealComponent;
  let fixture: ComponentFixture<MidDayMealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidDayMealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MidDayMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
