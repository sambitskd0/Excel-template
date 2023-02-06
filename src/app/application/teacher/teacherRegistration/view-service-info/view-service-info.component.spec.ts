import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceInfoComponent } from './view-service-info.component';

describe('ViewServiceInfoComponent', () => {
  let component: ViewServiceInfoComponent;
  let fixture: ComponentFixture<ViewServiceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewServiceInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewServiceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
