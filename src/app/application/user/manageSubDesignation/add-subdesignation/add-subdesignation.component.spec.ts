import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubdesignationComponent } from './add-subdesignation.component';

describe('AddSubdesignationComponent', () => {
  let component: AddSubdesignationComponent;
  let fixture: ComponentFixture<AddSubdesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubdesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubdesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
