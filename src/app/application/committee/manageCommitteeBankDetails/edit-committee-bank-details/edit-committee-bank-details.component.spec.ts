import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommitteeBankDetailsComponent } from './edit-committee-bank-details.component';

describe('EditCommitteeBankDetailsComponent', () => {
  let component: EditCommitteeBankDetailsComponent;
  let fixture: ComponentFixture<EditCommitteeBankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCommitteeBankDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommitteeBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
