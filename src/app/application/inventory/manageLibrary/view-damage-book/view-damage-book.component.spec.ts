import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDamageBookComponent } from './view-damage-book.component';

describe('ViewDamageBookComponent', () => {
  let component: ViewDamageBookComponent;
  let fixture: ComponentFixture<ViewDamageBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDamageBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDamageBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
