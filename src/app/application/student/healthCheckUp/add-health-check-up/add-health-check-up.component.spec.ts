import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthCheckUpComponent } from './add-health-check-up.component';

describe('AddHealthCheckUpComponent', () => {
  let component: AddHealthCheckUpComponent;
  let fixture: ComponentFixture<AddHealthCheckUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHealthCheckUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHealthCheckUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
