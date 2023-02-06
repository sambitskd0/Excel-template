import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubdesignationComponent } from './view-subdesignation.component';

describe('ViewSubdesignationComponent', () => {
  let component: ViewSubdesignationComponent;
  let fixture: ComponentFixture<ViewSubdesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubdesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubdesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
