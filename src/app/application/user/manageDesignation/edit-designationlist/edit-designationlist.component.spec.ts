import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDesignationlistComponent } from './edit-designationlist.component';

describe('EditDesignationlistComponent', () => {
  let component: EditDesignationlistComponent;
  let fixture: ComponentFixture<EditDesignationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDesignationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDesignationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
