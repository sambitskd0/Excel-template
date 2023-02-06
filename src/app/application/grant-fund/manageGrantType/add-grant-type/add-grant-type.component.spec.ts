import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrantTypeComponent } from './add-grant-type.component';

describe('AddGrantTypeComponent', () => {
  let component: AddGrantTypeComponent;
  let fixture: ComponentFixture<AddGrantTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGrantTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrantTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
