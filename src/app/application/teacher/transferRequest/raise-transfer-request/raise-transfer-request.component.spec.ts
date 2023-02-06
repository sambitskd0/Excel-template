import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseTransferRequestComponent } from './raise-transfer-request.component';

describe('RaiseTransferRequestComponent', () => {
  let component: RaiseTransferRequestComponent;
  let fixture: ComponentFixture<RaiseTransferRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseTransferRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseTransferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
