import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNagarNigamComponent } from './view-nagar-nigam.component';

describe('ViewNagarNigamComponent', () => {
  let component: ViewNagarNigamComponent;
  let fixture: ComponentFixture<ViewNagarNigamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNagarNigamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNagarNigamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
