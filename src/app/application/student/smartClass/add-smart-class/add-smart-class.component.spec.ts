import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmartClassComponent } from './add-smart-class.component';

describe('AddSmartClassComponent', () => {
  let component: AddSmartClassComponent;
  let fixture: ComponentFixture<AddSmartClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSmartClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSmartClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
