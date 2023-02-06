import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrantExpenditureComponent } from './edit-grant-expenditure.component';

describe('EditGrantExpenditureComponent', () => {
  let component: EditGrantExpenditureComponent;
  let fixture: ComponentFixture<EditGrantExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGrantExpenditureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrantExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
