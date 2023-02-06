import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgbvModalComponent } from './kgbv-modal.component';

describe('KgbvModalComponent', () => {
  let component: KgbvModalComponent;
  let fixture: ComponentFixture<KgbvModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KgbvModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KgbvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
