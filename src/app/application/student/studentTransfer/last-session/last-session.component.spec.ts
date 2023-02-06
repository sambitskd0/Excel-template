import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSessionComponent } from './last-session.component';

describe('LastSessionComponent', () => {
  let component: LastSessionComponent;
  let fixture: ComponentFixture<LastSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
