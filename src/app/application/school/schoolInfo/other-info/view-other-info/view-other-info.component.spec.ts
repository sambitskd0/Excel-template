import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOtherInfoComponent } from './view-other-info.component';

describe('ViewOtherInfoComponent', () => {
  let component: ViewOtherInfoComponent;
  let fixture: ComponentFixture<ViewOtherInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOtherInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOtherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
