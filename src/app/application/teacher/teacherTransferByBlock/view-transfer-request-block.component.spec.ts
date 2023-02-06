import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransferRequestBlockComponent } from './view-transfer-request-block.component';

describe('ViewTransferRequestBlockComponent', () => {
  let component: ViewTransferRequestBlockComponent;
  let fixture: ComponentFixture<ViewTransferRequestBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTransferRequestBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransferRequestBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
