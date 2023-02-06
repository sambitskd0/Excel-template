import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNagarNigamComponent } from './edit-nagar-nigam.component';

describe('EditNagarNigamComponent', () => {
  let component: EditNagarNigamComponent;
  let fixture: ComponentFixture<EditNagarNigamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNagarNigamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNagarNigamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
