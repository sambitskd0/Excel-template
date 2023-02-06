import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpenditureTypeComponent } from './view-expenditure-type.component';

describe('ViewExpenditureTypeComponent', () => {
  let component: ViewExpenditureTypeComponent;
  let fixture: ComponentFixture<ViewExpenditureTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpenditureTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpenditureTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
