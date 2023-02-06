import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContextComponent } from './view-context.component';

describe('ViewContextComponent', () => {
  let component: ViewContextComponent;
  let fixture: ComponentFixture<ViewContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
