import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDamageBookComponent } from './add-damage-book.component';

describe('AddDamageBookComponent', () => {
  let component: AddDamageBookComponent;
  let fixture: ComponentFixture<AddDamageBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDamageBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDamageBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
