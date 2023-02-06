import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContextTaggingComponent } from './view-context-tagging.component';

describe('ViewContextTaggingComponent', () => {
  let component: ViewContextTaggingComponent;
  let fixture: ComponentFixture<ViewContextTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContextTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContextTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
