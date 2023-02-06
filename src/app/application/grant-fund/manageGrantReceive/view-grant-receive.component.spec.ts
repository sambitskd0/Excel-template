import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrantReceiveComponent } from './view-grant-receive.component';

describe('ViewGrantReceiveComponent', () => {
  let component: ViewGrantReceiveComponent;
  let fixture: ComponentFixture<ViewGrantReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGrantReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrantReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
