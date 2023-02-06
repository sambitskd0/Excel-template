import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventtypeComponent } from './view-eventtype.component';

describe('ViewEventtypeComponent', () => {
  let component: ViewEventtypeComponent;
  let fixture: ComponentFixture<ViewEventtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEventtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEventtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
