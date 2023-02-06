import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHealthCheckUpComponent } from './view-health-check-up.component';

describe('ViewHealthCheckUpComponent', () => {
  let component: ViewHealthCheckUpComponent;
  let fixture: ComponentFixture<ViewHealthCheckUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHealthCheckUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHealthCheckUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
