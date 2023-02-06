import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBalpanjiComponent } from './view-balpanji.component';

describe('ViewBalpanjiComponent', () => {
  let component: ViewBalpanjiComponent;
  let fixture: ComponentFixture<ViewBalpanjiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBalpanjiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBalpanjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
