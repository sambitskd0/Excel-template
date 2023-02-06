import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCadComponent } from './update-cad.component';

describe('UpdateCadComponent', () => {
  let component: UpdateCadComponent;
  let fixture: ComponentFixture<UpdateCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
