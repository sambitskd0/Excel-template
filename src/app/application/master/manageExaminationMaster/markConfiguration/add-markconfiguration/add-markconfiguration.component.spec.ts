import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarkconfigurationComponent } from './add-markconfiguration.component';

describe('AddMarkconfigurationComponent', () => {
  let component: AddMarkconfigurationComponent;
  let fixture: ComponentFixture<AddMarkconfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMarkconfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarkconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
