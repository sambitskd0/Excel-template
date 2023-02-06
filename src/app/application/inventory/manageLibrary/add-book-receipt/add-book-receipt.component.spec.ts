import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookReceiptComponent } from './add-book-receipt.component';

describe('AddBookReceiptComponent', () => {
  let component: AddBookReceiptComponent;
  let fixture: ComponentFixture<AddBookReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBookReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
