import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentgrademasterComponent } from './view-studentgrademaster.component';

describe('ViewStudentgrademasterComponent', () => {
  let component: ViewStudentgrademasterComponent;
  let fixture: ComponentFixture<ViewStudentgrademasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentgrademasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentgrademasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
