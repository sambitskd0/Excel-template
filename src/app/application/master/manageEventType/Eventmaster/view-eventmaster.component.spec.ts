import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventmasterComponent } from './view-eventmaster.component';

describe('ViewEventmasterComponent', () => {
  let component: ViewEventmasterComponent;
  let fixture: ComponentFixture<ViewEventmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEventmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEventmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
