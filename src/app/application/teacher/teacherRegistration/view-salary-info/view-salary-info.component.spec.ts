import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalaryInfoComponent } from './view-salary-info.component';

describe('ViewSalaryInfoComponent', () => {
  let component: ViewSalaryInfoComponent;
  let fixture: ComponentFixture<ViewSalaryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSalaryInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
