import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNagarNigamComponent } from './add-nagar-nigam.component';

describe('AddNagarNigamComponent', () => {
  let component: AddNagarNigamComponent;
  let fixture: ComponentFixture<AddNagarNigamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNagarNigamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNagarNigamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
