import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventcategoryComponent } from './add-eventcategory.component';

describe('AddEventcategoryComponent', () => {
  let component: AddEventcategoryComponent;
  let fixture: ComponentFixture<AddEventcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
