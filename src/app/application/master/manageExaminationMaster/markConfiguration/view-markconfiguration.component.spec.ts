import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMarkconfigurationComponent } from './view-markconfiguration.component';

describe('ViewMarkconfigurationComponent', () => {
  let component: ViewMarkconfigurationComponent;
  let fixture: ComponentFixture<ViewMarkconfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMarkconfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMarkconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
