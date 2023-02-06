import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrantInfoComponent } from './view-grant-info.component';

describe('ViewGrantInfoComponent', () => {
  let component: ViewGrantInfoComponent;
  let fixture: ComponentFixture<ViewGrantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGrantInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
