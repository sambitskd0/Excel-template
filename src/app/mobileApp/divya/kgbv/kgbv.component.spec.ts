import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgbvComponent } from './kgbv.component';

describe('KgbvComponent', () => {
  let component: KgbvComponent;
  let fixture: ComponentFixture<KgbvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KgbvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KgbvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
