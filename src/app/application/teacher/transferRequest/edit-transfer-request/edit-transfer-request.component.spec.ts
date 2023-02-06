import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransferRequestComponent } from './edit-transfer-request.component';

describe('EditTransferRequestComponent', () => {
  let component: EditTransferRequestComponent;
  let fixture: ComponentFixture<EditTransferRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTransferRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTransferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
