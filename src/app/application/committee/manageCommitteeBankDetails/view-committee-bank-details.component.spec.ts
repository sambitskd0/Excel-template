import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommitteeBankDetailsComponent } from './view-committee-bank-details.component';

describe('ViewCommitteeBankDetailsComponent', () => {
  let component: ViewCommitteeBankDetailsComponent;
  let fixture: ComponentFixture<ViewCommitteeBankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCommitteeBankDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommitteeBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
