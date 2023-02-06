import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOpeningBalanceComponent } from './edit-opening-balance.component';

describe('EditOpeningBalanceComponent', () => {
  let component: EditOpeningBalanceComponent;
  let fixture: ComponentFixture<EditOpeningBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOpeningBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOpeningBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
