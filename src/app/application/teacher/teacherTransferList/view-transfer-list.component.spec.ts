import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransferListComponent } from './view-transfer-list.component';

describe('ViewTransferListComponent', () => {
  let component: ViewTransferListComponent;
  let fixture: ComponentFixture<ViewTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTransferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
