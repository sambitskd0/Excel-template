import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPeiComponent } from './view-pei.component';

describe('ViewPeiComponent', () => {
  let component: ViewPeiComponent;
  let fixture: ComponentFixture<ViewPeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPeiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
