import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransferRequestSchoolComponent } from './add-transfer-request-school.component';

describe('AddTransferRequestSchoolComponent', () => {
  let component: AddTransferRequestSchoolComponent;
  let fixture: ComponentFixture<AddTransferRequestSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTransferRequestSchoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransferRequestSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
