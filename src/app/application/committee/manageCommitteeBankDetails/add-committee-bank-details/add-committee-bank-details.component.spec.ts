import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommitteeBankDetailsComponent } from './add-committee-bank-details.component';

describe('AddCommitteeBankDetailsComponent', () => {
  let component: AddCommitteeBankDetailsComponent;
  let fixture: ComponentFixture<AddCommitteeBankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCommitteeBankDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommitteeBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
