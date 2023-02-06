import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChangeRequestComponent } from './view-change-request.component';

describe('ViewChangeRequestComponent', () => {
  let component: ViewChangeRequestComponent;
  let fixture: ComponentFixture<ViewChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
