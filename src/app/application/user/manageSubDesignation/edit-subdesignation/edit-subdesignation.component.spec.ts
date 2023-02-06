import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubdesignationComponent } from './edit-subdesignation.component';

describe('EditSubdesignationComponent', () => {
  let component: EditSubdesignationComponent;
  let fixture: ComponentFixture<EditSubdesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubdesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubdesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
