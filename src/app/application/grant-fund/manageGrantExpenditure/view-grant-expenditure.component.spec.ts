import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrantExpenditureComponent } from './view-grant-expenditure.component';

describe('ViewGrantExpenditureComponent', () => {
  let component: ViewGrantExpenditureComponent;
  let fixture: ComponentFixture<ViewGrantExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGrantExpenditureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrantExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
