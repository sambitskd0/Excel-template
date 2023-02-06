import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransferRequestSchoolComponent } from './view-transfer-request-school.component';

describe('ViewTransferRequestSchoolComponent', () => {
  let component: ViewTransferRequestSchoolComponent;
  let fixture: ComponentFixture<ViewTransferRequestSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTransferRequestSchoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransferRequestSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
