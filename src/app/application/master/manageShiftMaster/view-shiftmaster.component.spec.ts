import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShiftmasterComponent } from './view-shiftmaster.component';

describe('ViewShiftmasterComponent', () => {
  let component: ViewShiftmasterComponent;
  let fixture: ComponentFixture<ViewShiftmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewShiftmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewShiftmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
