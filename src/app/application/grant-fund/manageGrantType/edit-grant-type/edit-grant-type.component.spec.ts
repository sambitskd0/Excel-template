import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrantTypeComponent } from './edit-grant-type.component';

describe('EditGrantTypeComponent', () => {
  let component: EditGrantTypeComponent;
  let fixture: ComponentFixture<EditGrantTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGrantTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrantTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
