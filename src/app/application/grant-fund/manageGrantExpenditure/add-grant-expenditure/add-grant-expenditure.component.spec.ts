import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrantExpenditureComponent } from './add-grant-expenditure.component';

describe('AddGrantExpenditureComponent', () => {
  let component: AddGrantExpenditureComponent;
  let fixture: ComponentFixture<AddGrantExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGrantExpenditureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrantExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
