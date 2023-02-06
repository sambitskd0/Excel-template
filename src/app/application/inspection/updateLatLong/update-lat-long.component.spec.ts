import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLatLongComponent } from './update-lat-long.component';

describe('UpdateLatLongComponent', () => {
  let component: UpdateLatLongComponent;
  let fixture: ComponentFixture<UpdateLatLongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLatLongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLatLongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
