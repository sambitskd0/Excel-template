import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCategoryWiseDetailsComponent } from './school-category-wise-details.component';

describe('SchoolCategoryWiseDetailsComponent', () => {
  let component: SchoolCategoryWiseDetailsComponent;
  let fixture: ComponentFixture<SchoolCategoryWiseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolCategoryWiseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolCategoryWiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
