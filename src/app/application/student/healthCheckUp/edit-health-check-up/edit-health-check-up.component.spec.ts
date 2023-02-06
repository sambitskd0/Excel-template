import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHealthCheckUpComponent } from './edit-health-check-up.component';

describe('EditHealthCheckUpComponent', () => {
  let component: EditHealthCheckUpComponent;
  let fixture: ComponentFixture<EditHealthCheckUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHealthCheckUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHealthCheckUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
