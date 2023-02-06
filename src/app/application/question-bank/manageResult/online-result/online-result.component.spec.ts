import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineResultComponent } from './online-result.component';

describe('OnlineResultComponent', () => {
  let component: OnlineResultComponent;
  let fixture: ComponentFixture<OnlineResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
