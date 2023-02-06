import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCadComponent } from './view-cad.component';

describe('ViewCadComponent', () => {
  let component: ViewCadComponent;
  let fixture: ComponentFixture<ViewCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
