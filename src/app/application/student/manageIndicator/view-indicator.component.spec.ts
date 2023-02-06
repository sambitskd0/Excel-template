import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIndicatorComponent } from './view-indicator.component';

describe('ViewIndicatorComponent', () => {
  let component: ViewIndicatorComponent;
  let fixture: ComponentFixture<ViewIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
