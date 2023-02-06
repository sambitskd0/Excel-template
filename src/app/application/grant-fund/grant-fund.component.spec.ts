import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantFundComponent } from './grant-fund.component';

describe('GrantFundComponent', () => {
  let component: GrantFundComponent;
  let fixture: ComponentFixture<GrantFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantFundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
