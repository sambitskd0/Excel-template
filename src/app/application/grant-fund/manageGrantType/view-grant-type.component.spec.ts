import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrantTypeComponent } from './view-grant-type.component';

describe('ViewGrantTypeComponent', () => {
  let component: ViewGrantTypeComponent;
  let fixture: ComponentFixture<ViewGrantTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGrantTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrantTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
