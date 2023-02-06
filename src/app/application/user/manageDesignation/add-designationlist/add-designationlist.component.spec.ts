import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDesignationlistComponent } from './add-designationlist.component';

describe('AddDesignationlistComponent', () => {
  let component: AddDesignationlistComponent;
  let fixture: ComponentFixture<AddDesignationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDesignationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDesignationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
