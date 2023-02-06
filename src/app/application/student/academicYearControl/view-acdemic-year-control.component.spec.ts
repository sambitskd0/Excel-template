import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcdemicYearControlComponent } from './view-acdemic-year-control.component';

describe('ViewAcdemicYearControlComponent', () => {
  let component: ViewAcdemicYearControlComponent;
  let fixture: ComponentFixture<ViewAcdemicYearControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAcdemicYearControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAcdemicYearControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
