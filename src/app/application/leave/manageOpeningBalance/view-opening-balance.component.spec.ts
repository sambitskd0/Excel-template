import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOpeningBalanceComponent } from './view-opening-balance.component';

describe('ViewOpeningBalanceComponent', () => {
  let component: ViewOpeningBalanceComponent;
  let fixture: ComponentFixture<ViewOpeningBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOpeningBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOpeningBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
