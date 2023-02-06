import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftmasterComponent } from './add-shiftmaster.component';

describe('AddShiftmasterComponent', () => {
  let component: AddShiftmasterComponent;
  let fixture: ComponentFixture<AddShiftmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShiftmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShiftmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
