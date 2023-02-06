import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivyaMisComponent } from './divya-mis.component';

describe('DivyaMisComponent', () => {
  let component: DivyaMisComponent;
  let fixture: ComponentFixture<DivyaMisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivyaMisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivyaMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
