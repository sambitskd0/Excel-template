import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRelievingComponent } from './view-relieving.component';

describe('ViewRelievingComponent', () => {
  let component: ViewRelievingComponent;
  let fixture: ComponentFixture<ViewRelievingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRelievingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRelievingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
