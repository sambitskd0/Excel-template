import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventcategoryComponent } from './view-eventcategory.component';

describe('ViewEventcategoryComponent', () => {
  let component: ViewEventcategoryComponent;
  let fixture: ComponentFixture<ViewEventcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEventcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEventcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
