import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPfiComponent } from './view-pfi.component';

describe('ViewPfiComponent', () => {
  let component: ViewPfiComponent;
  let fixture: ComponentFixture<ViewPfiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPfiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPfiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
