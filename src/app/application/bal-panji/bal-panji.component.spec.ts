import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalPanjiComponent } from './bal-panji.component';

describe('BalPanjiComponent', () => {
  let component: BalPanjiComponent;
  let fixture: ComponentFixture<BalPanjiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalPanjiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalPanjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
