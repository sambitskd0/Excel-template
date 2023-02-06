import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShiftmasterComponent } from './edit-shiftmaster.component';

describe('EditShiftmasterComponent', () => {
  let component: EditShiftmasterComponent;
  let fixture: ComponentFixture<EditShiftmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShiftmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShiftmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
