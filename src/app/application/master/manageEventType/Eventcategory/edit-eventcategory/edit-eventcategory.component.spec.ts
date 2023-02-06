import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventcategoryComponent } from './edit-eventcategory.component';

describe('EditEventcategoryComponent', () => {
  let component: EditEventcategoryComponent;
  let fixture: ComponentFixture<EditEventcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
