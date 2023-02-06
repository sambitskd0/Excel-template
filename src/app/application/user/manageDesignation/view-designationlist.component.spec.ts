import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDesignationlistComponent } from './view-designationlist.component';

describe('ViewDesignationlistComponent', () => {
  let component: ViewDesignationlistComponent;
  let fixture: ComponentFixture<ViewDesignationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDesignationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDesignationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
