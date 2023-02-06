import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookReceiptComponent } from './view-book-receipt.component';

describe('ViewBookReceiptComponent', () => {
  let component: ViewBookReceiptComponent;
  let fixture: ComponentFixture<ViewBookReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBookReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
