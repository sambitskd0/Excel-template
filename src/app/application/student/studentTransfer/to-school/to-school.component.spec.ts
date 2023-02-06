import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToSchoolComponent } from './to-school.component';

describe('ToSchoolComponent', () => {
  let component: ToSchoolComponent;
  let fixture: ComponentFixture<ToSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToSchoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
