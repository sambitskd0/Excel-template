import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookReceiptComponent } from './edit-book-receipt.component';

describe('EditBookReceiptComponent', () => {
  let component: EditBookReceiptComponent;
  let fixture: ComponentFixture<EditBookReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBookReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
