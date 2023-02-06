import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMdmItemsComponent } from './edit-mdm-items.component';

describe('EditMdmItemsComponent', () => {
  let component: EditMdmItemsComponent;
  let fixture: ComponentFixture<EditMdmItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMdmItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMdmItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
