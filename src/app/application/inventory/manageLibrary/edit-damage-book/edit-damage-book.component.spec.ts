import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDamageBookComponent } from './edit-damage-book.component';

describe('EditDamageBookComponent', () => {
  let component: EditDamageBookComponent;
  let fixture: ComponentFixture<EditDamageBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDamageBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDamageBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
